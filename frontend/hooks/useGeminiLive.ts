import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import base64 from 'base-64';

// Robust FileSystem constants
const CACHE_DIR = FileSystem.cacheDirectory || '';
const ENCODING_BASE64 = 'base64';

// Dynamic backend URL
const BACKEND_WS_URL = process.env.EXPO_PUBLIC_BACKEND_WS_URL || 'ws://192.168.0.104:8000/gemini/ws/chat';

export function useGeminiLive() {
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const recording = useRef<Audio.Recording | null>(null);
    const sound = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        // Request permissions
        Audio.requestPermissionsAsync();
        Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        return () => {
            disconnect();
        };
    }, []);

    const connect = () => {
        try {
            console.log('Connecting to Gemini Live at:', BACKEND_WS_URL);
            ws.current = new WebSocket(BACKEND_WS_URL);

            ws.current.onopen = () => {
                setIsConnected(true);
                startRecording();
            };

            ws.current.onmessage = async (event) => {
                if (typeof event.data === 'string') {
                    const data = JSON.parse(event.data);
                    if (data.type === 'turn_complete') {
                        setIsSpeaking(false);
                    }
                } else {
                    // We received binary audio data from Gemini
                    playAudioChunk(event.data);
                }
            };

            ws.current.onclose = () => {
                setIsConnected(false);
                stopRecording();
            };

            ws.current.onerror = (e) => {
                console.error('WebSocket Error:', e);
                setIsConnected(false);
                stopRecording();
            };
        } catch (error) {
            console.error('Connection failed:', error);
            setIsConnected(false);
            stopRecording();
        }
    };

    const disconnect = () => {
        ws.current?.close();
        stopRecording();
        setIsConnected(false);
    };

    const startRecording = async () => {
        try {
            // CRITICAL: Clean up any existing recording object first
            if (recording.current) {
                console.log('Cleaning up existing recording object...');
                try {
                    await recording.current.stopAndUnloadAsync();
                } catch (e) {
                    // Ignore errors if already stopped
                }
                recording.current = null;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: rec } = await Audio.Recording.createAsync({
                android: {
                    extension: '.wav',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.wav',
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {},
            });

            recording.current = rec;
            setIsListening(true);

            // Simple implementation: Send chunks every 500ms
            const interval = setInterval(async () => {
                if (ws.current?.readyState === WebSocket.OPEN && recording.current) {
                    const status = await recording.current.getStatusAsync();
                    if (status.isRecording && status.durationMillis > 100) {
                        // Real low-latency would need PCM streaming natives
                    }
                }
            }, 500);

        } catch (err) {
            console.error('Failed to start recording', err);
            setIsListening(false);
            stopRecording();
        }
    };

    const stopRecording = async () => {
        try {
            setIsListening(false);
            if (recording.current) {
                await recording.current.stopAndUnloadAsync();
                recording.current = null;
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
            recording.current = null;
        }
    };

    const playAudioChunk = async (arrayBuffer: ArrayBuffer) => {
        try {
            setIsSpeaking(true);

            // Convert ArrayBuffer to Base64 safely
            const uint8 = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < uint8.length; i++) {
                binary += String.fromCharCode(uint8[i]);
            }
            const base64Data = base64.encode(binary);

            const fileUri = `${CACHE_DIR}gemini_response_${Date.now()}.mp3`;
            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: ENCODING_BASE64 as any
            });

            const { sound: newSound } = await Audio.Sound.createAsync({ uri: fileUri });
            sound.current = newSound;
            await newSound.playAsync();

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsSpeaking(false);
                    newSound.unloadAsync();
                }
            });
        } catch (err) {
            console.error('Error playing audio chunk', err);
            setIsSpeaking(false);
        }
    };

    const sendImage = (base64String: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'image', data: base64String }));
        }
    };

    return { isConnected, isSpeaking, isListening, connect, disconnect, sendImage };
}

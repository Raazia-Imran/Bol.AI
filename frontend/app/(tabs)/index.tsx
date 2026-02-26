import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { GlowingOrb } from '../../components/GlowingOrb';
import { useGeminiLive } from '../../hooks/useGeminiLive';
import { Brand } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

function LiveCoachingScreen() {
  const {
    isConnected,
    isSpeaking,
    isListening,
    connect,
    disconnect
  } = useGeminiLive();

  const toggleSession = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Area */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Bol.AI</Text>
          <Text style={styles.subtitle}>
            {isConnected ? 'Session Active' : 'Ready to coach'}
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={Brand.slate} />
        </TouchableOpacity>
      </View>

      {/* Main Interaction Area */}
      <View style={styles.content}>
        <View style={styles.orbContainer}>
          <GlowingOrb isSpeaking={isSpeaking} isListening={isListening && isConnected} />
        </View>

        {/* Status Text Area */}
        <View style={styles.statusArea}>
          {isConnected ? (
            <Text style={styles.instruction}>
              {isSpeaking ? 'Bol.AI is speaking...' : 'I am listening... go ahead!'}
            </Text>
          ) : (
            <Text style={styles.instruction}>
              Tap the button below to start your English fluency session.
            </Text>
          )}
        </View>
      </View>

      {/* Control Bar */}
      <View style={styles.controls}>
        {!isConnected ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={toggleSession}
            activeOpacity={0.8}
          >
            <Ionicons name="mic" size={28} color={Brand.charcoal} />
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.endButton}
            onPress={toggleSession}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
            <Text style={styles.endButtonText}>End Call</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.charcoal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Brand.gold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Brand.slate,
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbContainer: {
    marginBottom: 60,
  },
  statusArea: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instruction: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: Brand.cyan,
    height: 64,
    width: '100%',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: Brand.cyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Brand.charcoal,
  },
  endButton: {
    backgroundColor: '#FF4B4B',
    height: 64,
    width: '100%',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#FF4B4B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  endButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default LiveCoachingScreen;

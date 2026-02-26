import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

// Required for expo-auth-session to close the browser on redirect
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_OAUTH_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/authorize`;

export default function LoginScreen() {
    const redirectUri = makeRedirectUri({ scheme: 'frontend' });

    useEffect(() => {
        console.log('Redirect URI:', redirectUri);
    }, [redirectUri]);

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: 'bolai-app', // placeholder — Supabase handles OAuth internally
            scopes: ['openid', 'profile', 'email'],
            redirectUri,
        },
        {
            authorizationEndpoint: GOOGLE_OAUTH_URL,
        }
    );

    const [loading, setLoading] = React.useState(false);

    const signInWithGoogle = async () => {
        setLoading(true);
        const redirectUriLocal = makeRedirectUri();
        console.log('Redirect URI:', redirectUriLocal);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUriLocal,
                    skipBrowserRedirect: true, // THIS IS CRITICAL FOR REACT NATIVE
                },
            });

            if (error) throw error;

            if (data?.url) {
                console.log('Opening Auth Session...');
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUriLocal);

                if (result.type === 'success' && result.url) {
                    console.log('Auth success, extracted URL:', result.url);
                    const url = new URL(result.url);
                    const fragment = url.hash.substring(1);
                    const params = new URLSearchParams(fragment || url.search);
                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    if (accessToken && refreshToken) {
                        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
                        console.log('Session set, navigating to tabs...');
                        router.replace('/(tabs)');
                    }
                }
            }
        } catch (err) {
            console.error('Google Sign-In error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background gradient effect */}
            <View style={styles.gradientOverlay} />

            {/* Glowing orb decoration */}
            <View style={styles.orbDecoration} />

            <View style={styles.content}>
                {/* Logo & Branding */}
                <View style={styles.logoSection}>
                    <Text style={styles.logoText}>bol.ai</Text>
                    <Text style={styles.tagline}>Speak with confidence.</Text>
                    <Text style={styles.subTagline}>Your personal English fluency coach — built for Pakistan.</Text>
                </View>

                {/* Feature Pills */}
                <View style={styles.pillsContainer}>
                    {['Real-time AI coaching', 'Minglish understood', 'Vision roleplay'].map((feature) => (
                        <View key={feature} style={styles.pill}>
                            <Text style={styles.pillText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                {/* Sign In Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Get Started</Text>
                    <Text style={styles.cardSubtitle}>Sign in to begin your fluency journey</Text>

                    <TouchableOpacity
                        style={[styles.googleButton, loading && styles.googleButtonDisabled]}
                        onPress={signInWithGoogle}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#121418" size="small" />
                        ) : (
                            <>
                                <Text style={styles.googleIcon}>G</Text>
                                <Text style={styles.googleButtonText}>Continue with Google</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.disclaimer}>
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121418',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'transparent',
        // Simulated gradient via opacity layers
    },
    orbDecoration: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: '#00E5FF',
        opacity: 0.06,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 100,
        paddingBottom: 48,
        justifyContent: 'space-between',
    },
    logoSection: {
        alignItems: 'flex-start',
    },
    logoText: {
        fontSize: 52,
        fontWeight: '800',
        color: '#D4AF37',
        letterSpacing: -1.5,
        marginBottom: 12,
    },
    tagline: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subTagline: {
        fontSize: 15,
        color: '#8891A4',
        lineHeight: 22,
        maxWidth: 280,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 32,
    },
    pill: {
        backgroundColor: 'rgba(0, 229, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    pillText: {
        color: '#00E5FF',
        fontSize: 12,
        fontWeight: '600',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 28,
        // Glassmorphism
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 10,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#8891A4',
        marginBottom: 28,
    },
    googleButton: {
        backgroundColor: '#D4AF37',
        borderRadius: 14,
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    googleButtonDisabled: {
        opacity: 0.6,
    },
    googleIcon: {
        fontSize: 18,
        fontWeight: '800',
        color: '#121418',
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#121418',
    },
    disclaimer: {
        marginTop: 16,
        fontSize: 11,
        color: '#4A5568',
        textAlign: 'center',
        lineHeight: 16,
    },
});

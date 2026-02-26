import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';

interface GlowingOrbProps {
    isSpeaking: boolean;
    isListening: boolean;
}

export const GlowingOrb: React.FC<GlowingOrbProps> = ({ isSpeaking, isListening }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.6);
    const rotation = useSharedValue(0);

    useEffect(() => {
        // Base breathing animation
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1,
            true
        );

        // Rotation animation
        rotation.value = withRepeat(
            withTiming(360, { duration: 10000 }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        // Dynamic scaling based on speaking/listening states
        const dynamicScale = isSpeaking ? 1.3 : isListening ? 1.15 : 1;

        return {
            transform: [
                { scale: scale.value * dynamicScale },
                { rotate: `${rotation.value}deg` }
            ],
            opacity: opacity.value,
        };
    });

    const glowStyle = useAnimatedStyle(() => {
        return {
            shadowRadius: interpolate(scale.value, [1, 1.1], [20, 40], Extrapolate.CLAMP),
            shadowOpacity: interpolate(scale.value, [1, 1.1], [0.4, 0.8], Extrapolate.CLAMP),
        };
    });

    return (
        <View style={styles.container}>
            {/* Outer glow aura */}
            <Animated.View style={[styles.aura, { borderColor: '#00E5FF' }, animatedStyle]} />
            <Animated.View style={[styles.aura, { borderColor: '#D4AF37', transform: [{ scale: 0.8 }] }, animatedStyle]} />

            {/* Central Core */}
            <Animated.View style={[styles.orb, glowStyle]}>
                <View style={styles.innerCore} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 300,
    },
    orb: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#121418',
        borderWidth: 2,
        borderColor: '#00E5FF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        elevation: 20,
    },
    innerCore: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D4AF37',
        opacity: 0.8,
    },
    aura: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 1,
        opacity: 0.3,
    },
});

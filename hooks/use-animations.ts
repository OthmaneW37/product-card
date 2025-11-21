import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Hook pour animer l'entrée d'un élément
 * Fade + Scale + Translate combinés
 */
export function useAnimatedEntrance(delay: number = 0) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, scaleAnim, translateYAnim, delay]);

  return {
    opacity: fadeAnim,
    transform: [
      { scale: scaleAnim },
      { translateY: translateYAnim },
    ],
  };
}

/**
 * Hook pour animer la sortie d'un élément
 * Fade out + Scale down
 */
export function useAnimatedExit() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateOut = () => {
    return new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  return {
    animatedStyle: {
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }],
    },
    animateOut,
  };
}

/**
 * Hook pour animations de bounce
 */
export function useBouncingAnimation(triggerKey: string | number) {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.bounce),
        useNativeDriver: true,
      }),
    ]).start();
  }, [triggerKey, bounceAnim]);

  return {
    transform: [{ translateY: bounceAnim }],
  };
}

/**
 * Hook pour progressBar animation
 */
export function useProgressAnimation(progress: number, duration: number = 800) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim, duration]);

  return progressAnim;
}

/**
 * Hook pour pulsing animation
 * Utile pour highlighting de badges
 */
export function usePulsingAnimation(duration: number = 1000) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: duration / 2,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, duration]);

  return {
    transform: [{ scale: pulseAnim }],
  };
}

/**
 * Hook pour shake animation
 * Utile pour erreurs
 */
export function useShakeAnimation(trigger: boolean) {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;

    Animated.sequence([
      ...Array.from({ length: 4 }).map(() =>
        Animated.timing(shakeAnim, {
          toValue: Math.random() * 10 - 5,
          duration: 50,
          useNativeDriver: true,
        })
      ),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [trigger, shakeAnim]);

  return {
    transform: [{ translateX: shakeAnim }],
  };
}

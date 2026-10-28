import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** Faz o conteúdo surgir aos poucos (opacidade de 0 a 1). */
export function FadeIn({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

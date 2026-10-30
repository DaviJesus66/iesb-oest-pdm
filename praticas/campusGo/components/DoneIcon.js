import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

/** Ícone que "pulsa" toda vez que o valor de "trigger" aumenta. */
export function DoneIcon({ trigger, children }) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (trigger > 0) {
      scale.value = withSequence(withSpring(1.3), withSpring(1));
    }
  }, [trigger]);

  return <Animated.View style={style}>{children}</Animated.View>;
}

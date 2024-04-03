import { useRef } from "react";
import { Animated } from "react-native";

export const useHandleScroll = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: true }
    );
    return { scrollY, handleScroll };
  };

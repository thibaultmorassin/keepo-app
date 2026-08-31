/**
 * Reanimated versions of the CSS-enabled primitives.
 *
 * The CSS wrapper sits *inside* the animated component, so `className`
 * resolves to a style object before Reanimated composes its own on top —
 * meaning `className` and an `animatedStyle` passed through `style` coexist.
 */
import RNAnimated from "react-native-reanimated";
import * as TW from "./index";

export const Animated = {
  ...RNAnimated,
  View: RNAnimated.createAnimatedComponent(TW.View),
  Text: RNAnimated.createAnimatedComponent(TW.Text),
  Pressable: RNAnimated.createAnimatedComponent(TW.Pressable),
  ScrollView: RNAnimated.createAnimatedComponent(TW.ScrollView),
};

export default Animated;

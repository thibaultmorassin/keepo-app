/**
 * CSS-enabled React Native primitives.
 *
 * react-native-css requires every component that accepts `className` to be
 * explicitly wrapped, so these are the app's styleable building blocks. Import
 * from `@/tw` instead of `react-native` anywhere you need Tailwind classes.
 */
import { Link as RouterLink } from "expo-router";
import type { ComponentProps, ReactElement } from "react";
import {
  Image as RNImage,
  Modal as RNModal,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
  type ImageProps as RNImageProps,
  type ModalProps as RNModalProps,
  type PressableProps as RNPressableProps,
  type ScrollViewProps as RNScrollViewProps,
  type TextInputProps as RNTextInputProps,
  type TextProps as RNTextProps,
  type ViewProps as RNViewProps,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from "react-native-css";

/**
 * `useCssElement` infers its mapping against the target component's props, and
 * for the wider RN components (Pressable, ScrollView) that inference explodes
 * into a union TypeScript refuses to represent (TS2590). The public prop types
 * below are written by hand anyway, so erase the generics here.
 */
const cssElement = useCssElement as (
  component: unknown,
  props: unknown,
  mapping: Record<string, string>,
) => ReactElement;

const style = { className: "style" };

/** Read a CSS custom property as a JS value. */
export const useCSSVariable =
  process.env.EXPO_OS !== "web"
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

type WithClassName<P> = P & { className?: string };

export type ViewProps = WithClassName<RNViewProps>;
export const View = (props: ViewProps) => cssElement(RNView, props, style);
View.displayName = "CSS(View)";

export type TextProps = WithClassName<RNTextProps>;
export const Text = (props: TextProps) => cssElement(RNText, props, style);
Text.displayName = "CSS(Text)";

export type PressableProps = WithClassName<RNPressableProps>;
export const Pressable = (props: PressableProps) =>
  cssElement(RNPressable, props, style);
Pressable.displayName = "CSS(Pressable)";

export type ImageProps = WithClassName<RNImageProps>;
export const Image = (props: ImageProps) => cssElement(RNImage, props, style);
Image.displayName = "CSS(Image)";

export type ModalProps = WithClassName<RNModalProps>;
export const Modal = (props: ModalProps) => cssElement(RNModal, props, style);
Modal.displayName = "CSS(Modal)";

export type TextInputProps = WithClassName<RNTextInputProps>;
export const TextInput = (props: TextInputProps) =>
  cssElement(RNTextInput, props, style);
TextInput.displayName = "CSS(TextInput)";

export type ScrollViewProps = WithClassName<RNScrollViewProps> & {
  contentContainerClassName?: string;
};
export const ScrollView = (props: ScrollViewProps) =>
  cssElement(RNScrollView, props, {
    className: "style",
    contentContainerClassName: "contentContainerStyle",
  });
ScrollView.displayName = "CSS(ScrollView)";

export type SafeAreaViewProps = WithClassName<
  ComponentProps<typeof RNSafeAreaView>
>;
export const SafeAreaView = (props: SafeAreaViewProps) =>
  cssElement(RNSafeAreaView, props, style);
SafeAreaView.displayName = "CSS(SafeAreaView)";

export type LinkProps = WithClassName<ComponentProps<typeof RouterLink>>;
export const Link = (props: LinkProps) => cssElement(RouterLink, props, style);

Link.Trigger = RouterLink.Trigger;
Link.Menu = RouterLink.Menu;
Link.MenuAction = RouterLink.MenuAction;
Link.Preview = RouterLink.Preview;

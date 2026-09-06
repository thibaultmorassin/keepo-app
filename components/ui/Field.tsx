import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { color } from "@/theme/tokens";
import { Text, TextInput, View } from "@/tw";
import clsx from "clsx";
import { useState } from "react";
import type { TextInputProps } from "react-native";
import { twMerge } from "tailwind-merge";

type FieldProps = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  secureTextEntry?: boolean;
  suffix?: string;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
} & Pick<
  TextInputProps,
  | "keyboardType"
  | "autoCapitalize"
  | "autoComplete"
  | "autoCorrect"
  | "textContentType"
>;

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  secureTextEntry = false,
  suffix,
  multiline = false,
  numberOfLines,
  className,
  ...inputProps
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View className={twMerge("gap-1.5", className)}>
      <Text className="type-micro text-secondary">{label}</Text>
      <View className="relative justify-center">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.textMuted}
          secureTextEntry={hidden}
          multiline={multiline}
          numberOfLines={multiline ? (numberOfLines ?? 4) : undefined}
          textAlignVertical={multiline ? "top" : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={clsx(
            "w-full rounded-input border border-line bg-card px-3.5 py-3 font-sans text-[14.5px] text-primary",
            // the focus ring is 2px, so shed a pixel of padding to hold size
            focused && "border-2 border-green-200 px-3.25 py-2.75",
            error && "border-claim-fg",
            (secureTextEntry || suffix) && "pr-12",
            multiline && "min-h-[110px] py-3",
          )}
          {...inputProps}
        />
        {secureTextEntry ? (
          <View className="absolute right-1.5">
            <IconButton
              label={
                hidden ? "Afficher le mot de passe" : "Masquer le mot de passe"
              }
              variant="ghost"
              size="sm"
              onPress={() => setHidden((current) => !current)}
            >
              <Icon
                name={hidden ? "eye" : "eye-off"}
                size={18}
                color={color.textMuted}
              />
            </IconButton>
          </View>
        ) : suffix ? (
          <Text className="type-mono absolute right-3.5 text-muted">
            {suffix}
          </Text>
        ) : null}
      </View>
      {error ? (
        <Text className="type-caption text-claim-fg">{error}</Text>
      ) : hint ? (
        <Text className="type-caption text-muted">{hint}</Text>
      ) : null}
    </View>
  );
}

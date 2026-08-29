import { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/components/ui/Icon";
import { color, radius, space } from "@/theme/tokens";
import { fontFamily, type } from "@/theme/typography";

type FieldProps = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  secureTextEntry?: boolean;
  suffix?: string;
  style?: StyleProp<ViewStyle>;
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
  style,
  ...inputProps
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.textMuted}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            focused && styles.inputFocused,
            error && styles.inputError,
            secureTextEntry || suffix ? styles.inputWithSuffix : null,
          ]}
          {...inputProps}
        />
        {secureTextEntry ? (
          <View style={styles.suffix}>
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
          <Text style={styles.suffixText}>{suffix}</Text>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: space[3],
  },
  label: {
    ...type.micro,
    color: color.textSecondary,
  },
  inputRow: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: color.borderSubtle,
    backgroundColor: color.bgCard,
    borderRadius: radius.input,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: fontFamily.sans,
    fontSize: 14.5,
    color: color.textPrimary,
  },
  inputFocused: {
    borderColor: color.green200,
    borderWidth: 2,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  inputWithSuffix: {
    paddingRight: 48,
  },
  inputError: {
    borderColor: color.actionClaimFg,
  },
  suffix: {
    position: "absolute",
    right: 6,
  },
  suffixText: {
    ...type.mono,
    position: "absolute",
    right: 14,
    color: color.textMuted,
  },
  hint: {
    ...type.caption,
    color: color.textMuted,
  },
  errorText: {
    ...type.caption,
    color: color.actionClaimFg,
  },
});

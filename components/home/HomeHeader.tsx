import { color, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import { formatEyebrowDate } from "@/utils/format";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HomeHeaderProps = {
  initials: string;
};

export function HomeHeader({ initials }: HomeHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{formatEyebrowDate()}</Text>
        <Text style={styles.title}>Vos garanties</Text>
      </View>
      <Link href="/settings" asChild>
        <Pressable style={styles.avatar} hitSlop={10}>
          <Text style={styles.initials}>{initials}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space[5],
    flexShrink: 0,
  },
  copy: {
    flex: 1,
  },
  eyebrow: {
    ...type.micro,
    color: color.textSecondary,
  },
  title: {
    ...type.display,
    color: color.textPrimary,
    marginTop: 3,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: color.brandTint,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  initials: {
    ...type.heading,
    color: color.brandStrong,
    fontSize: 15,
    lineHeight: 18,
  },
});

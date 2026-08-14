import {
  BellRing,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Receipt,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react-native";
import { color } from "@/theme/tokens";

const ICONS = {
  "bell-ring": BellRing,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  eye: Eye,
  "eye-off": EyeOff,
  receipt: Receipt,
  "shield-check": ShieldCheck,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 2.25,
  color: iconColor = color.textPrimary,
}: IconProps) {
  const LucideIcon = ICONS[name];
  return <LucideIcon size={size} strokeWidth={strokeWidth} color={iconColor} />;
}

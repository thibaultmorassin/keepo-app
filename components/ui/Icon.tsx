import {
  BellRing,
  Bike,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Eye,
  EyeOff,
  Headphones,
  Laptop,
  LayoutGrid,
  Package,
  Plus,
  Receipt,
  Settings,
  ShieldCheck,
  Smartphone,
  Trees,
  WashingMachine,
  type LucideIcon,
} from "lucide-react-native";
import { color } from "@/theme/tokens";

const ICONS = {
  "bell-ring": BellRing,
  bike: Bike,
  check: Check,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  coffee: Coffee,
  eye: Eye,
  "eye-off": EyeOff,
  headphones: Headphones,
  laptop: Laptop,
  "layout-grid": LayoutGrid,
  package: Package,
  plus: Plus,
  receipt: Receipt,
  settings: Settings,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  trees: Trees,
  "washing-machine": WashingMachine,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  accessibilityLabel?: string;
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 2.25,
  color: iconColor = color.textPrimary,
  accessibilityLabel,
}: IconProps) {
  const LucideIcon = ICONS[name];
  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      color={iconColor}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

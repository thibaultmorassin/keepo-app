import { color } from "@/theme/tokens";
import {
  BellRing,
  Bike,
  BookOpen,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Download,
  Ellipsis,
  Eye,
  EyeOff,
  FileText,
  Headphones,
  Image as ImageIcon,
  Laptop,
  LayoutGrid,
  LifeBuoy,
  Lock,
  Mail,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Receipt,
  ScanLine,
  Settings,
  ShieldCheck,
  Smartphone,
  Trees,
  TriangleAlert,
  WashingMachine,
  X,
  type LucideIcon,
} from "lucide-react-native";
import React from "react";

const ICONS = {
  "bell-ring": BellRing,
  bike: Bike,
  "book-open": BookOpen,
  calendar: Calendar,
  camera: Camera,
  check: Check,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  coffee: Coffee,
  download: Download,
  ellipsis: Ellipsis,
  eye: Eye,
  "eye-off": EyeOff,
  "file-text": FileText,
  headphones: Headphones,
  image: ImageIcon,
  laptop: Laptop,
  "layout-grid": LayoutGrid,
  "life-buoy": LifeBuoy,
  lock: Lock,
  mail: Mail,
  "message-circle": MessageCircle,
  package: Package,
  pencil: Pencil,
  plus: Plus,
  receipt: Receipt,
  "scan-line": ScanLine,
  settings: Settings,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  trees: Trees,
  "triangle-alert": TriangleAlert,
  "washing-machine": WashingMachine,
  x: X,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

type IconProps = React.ComponentProps<LucideIcon> & {
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
  ...props
}: IconProps) {
  const LucideIcon = ICONS[name];

  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      color={iconColor}
      accessibilityLabel={accessibilityLabel}
      {...props}
    />
  );
}

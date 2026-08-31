import { Text, View } from "@/tw";
import clsx from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type BadgeStatus =
  | "covered"
  | "expiring"
  | "expired"
  | "claim"
  | "pro"
  | "inverse"
  | "free";

type BadgeProps = {
  children: ReactNode;
  status?: BadgeStatus;
  icon?: ReactNode;
  className?: string;
};

const skins: Record<BadgeStatus, string> = {
  covered: "bg-covered-bg",
  expiring: "bg-expiring-bg",
  expired: "bg-expired-bg",
  claim: "bg-claim-bg",
  pro: "bg-pro-bg",
  inverse: "bg-on-dark/18",
  free: "bg-sunken",
};

const labels: Record<BadgeStatus, string> = {
  covered: "text-covered-fg",
  expiring: "text-expiring-fg",
  expired: "text-expired-fg",
  claim: "text-claim-fg",
  pro: "text-pro-fg",
  inverse: "text-on-dark",
  free: "text-secondary",
};

/** Small status pill. The status word is the colour system — pick the status. */
export function Badge({
  children,
  status = "covered",
  icon,
  className,
}: BadgeProps) {
  return (
    <View
      className={twMerge(
        clsx(
          "shrink-0 flex-row items-center gap-1 self-start rounded-pill px-2.5 py-1",
          skins[status],
        ),
        className,
      )}
    >
      {icon}
      <Text
        className={clsx("type-caption-semibold", labels[status])}
        numberOfLines={1}
      >
        {children}
      </Text>
    </View>
  );
}

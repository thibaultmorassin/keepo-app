import { Text, View } from "@/tw";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type EmptyStateProps = {
  title: string;
  body?: string;
  icon?: ReactNode;
  action: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  body,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <View
      className={twMerge(
        "items-center gap-3 rounded-hero bg-sunken px-5 py-8",
        className,
      )}
    >
      {icon ? (
        <View className="size-15.5 items-center justify-center rounded-pill bg-card shadow-sm">
          {icon}
        </View>
      ) : null}
      <View className="items-center">
        <Text className="type-title text-center text-primary">{title}</Text>
        {body ? (
          <Text className="type-body mt-1.5 max-w-70 text-center text-secondary">
            {body}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

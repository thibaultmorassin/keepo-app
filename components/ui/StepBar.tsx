import { View } from "@/tw";
import { twMerge } from "tailwind-merge";

type StepBarProps = {
  total: number;
  /** 1-indexed — segments before this one are filled. */
  current: number;
  className?: string;
};

/** A row of pill segments marking progress through a numbered flow. */
export function StepBar({ total, current, className }: StepBarProps) {
  return (
    <View className={twMerge("flex-row gap-3", className)}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          className={twMerge(
            "h-[5px] flex-1 rounded-pill",
            index < current ? "bg-brand" : "bg-paper-3",
          )}
        />
      ))}
    </View>
  );
}

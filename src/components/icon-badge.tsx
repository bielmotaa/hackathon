import { ReactNode } from "react"
import { View } from "react-native"
import clsx from "clsx"

interface IconBadgeProps {
  icon: ReactNode
  tone?: "brand" | "inverted" | "danger"
}

export function IconBadge({ icon, tone = "brand" }: IconBadgeProps) {
  return (
    <View
      className={clsx(
        "h-10 w-10 items-center justify-center rounded-xl",
        tone === "inverted" && "bg-white/15",
        tone === "danger" && "bg-red-50",
        tone === "brand" && "bg-signup-primary/10"
      )}
    >
      {icon}
    </View>
  )
}

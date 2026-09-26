import { Text, TouchableOpacity, View } from "react-native"
import clsx from "clsx"
import { ShieldAlert, ShieldCheck } from "lucide-react-native"

interface SessionStatusBadgeProps {
  isExpired: boolean
  onPressExpired: () => void
  tone?: "on-brand" | "on-surface"
}

export function SessionStatusBadge({
  isExpired,
  onPressExpired,
  tone = "on-brand",
}: SessionStatusBadgeProps) {
  const activeColor = tone === "on-brand" ? "#ffffff" : "#265AB9"

  const content = (
    <>
      {isExpired ? (
        <ShieldAlert size={14} color="#B91C1C" />
      ) : (
        <ShieldCheck size={14} color={activeColor} />
      )}
      <Text
        className={clsx(
          "ml-2 text-xs font-semibold",
          isExpired
            ? "text-red-700"
            : tone === "on-brand"
              ? "text-white"
              : "text-signup-primary"
        )}
      >
        {isExpired ? "Sessão expirada — toque para entrar" : "Sessão ativa"}
      </Text>
    </>
  )

  const containerClassName = clsx(
    "flex-row items-center self-start rounded-full px-3 py-1.5",
    isExpired
      ? "bg-red-100"
      : tone === "on-brand"
        ? "bg-white/15"
        : "bg-signup-primary/10"
  )

  if (!isExpired) {
    return (
      <View
        accessibilityRole="text"
        accessibilityLabel="Sessão ativa"
        className={containerClassName}
      >
        {content}
      </View>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPressExpired}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Sessão expirada"
      className={containerClassName}
    >
      {content}
    </TouchableOpacity>
  )
}

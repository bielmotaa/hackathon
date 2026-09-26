import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { ViewState } from "@/shared/utils/request-error"

interface StatusMessageProps {
  state: Exclude<ViewState, "idle" | "success">
  message: string
  onRetry?: () => void
  actionLabel?: string
}

export function StatusMessage({ state, message, onRetry, actionLabel }: StatusMessageProps) {
  if (state === "loading") {
    return (
      <View className="h-24 items-center justify-center">
        <ActivityIndicator color="#E2723A" />
      </View>
    )
  }

  return (
    <View className="mx-6 items-center gap-3 rounded-3xl bg-tourism-forest px-4 py-5">
      <Text className="text-center font-sans text-sm text-tourism-mist">{message}</Text>
      {onRetry && (state === "error" || actionLabel) ? (
        <TouchableOpacity onPress={onRetry} activeOpacity={0.8}>
          <Text className="font-sans-semibold text-sm text-tourism-ember">{actionLabel ?? "Tentar novamente"}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

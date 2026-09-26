import { ReactElement } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import clsx from "clsx"
import { MapPin, MapPinOff, Wifi, WifiOff } from "lucide-react-native"

interface StatusChipProps {
  icon: ReactElement
  text: string
  isOk: boolean
  onPress?: () => void
}

function StatusChip({ icon, text, isOk, onPress }: StatusChipProps) {
  return (
    <TouchableOpacity
      onPress={isOk ? undefined : onPress}
      disabled={isOk}
      activeOpacity={isOk ? 1 : 0.7}
      className="flex-1 flex-row items-center gap-2"
    >
      {icon}
      <Text
        className={clsx(
          "flex-1 text-xs font-semibold",
          isOk ? "text-signup-text" : "text-red-600"
        )}
        numberOfLines={1}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

interface DeviceStatusCardProps {
  isLocationGranted: boolean
  onPressLocation: () => void
  isConnected: boolean
}

export function DeviceStatusCard({
  isLocationGranted,
  onPressLocation,
  isConnected,
}: DeviceStatusCardProps) {
  return (
    <View className="flex-row items-center rounded-xl bg-white/60 px-4 py-2.5">
      <StatusChip
        icon={
          isLocationGranted ? (
            <MapPin size={14} color="#265AB9" />
          ) : (
            <MapPinOff size={14} color="#DC2626" />
          )
        }
        text={isLocationGranted ? "Localização permitida" : "Localização não permitida"}
        isOk={isLocationGranted}
        onPress={onPressLocation}
      />

      <View className="mx-3 h-3 w-px bg-signup-gray/25" />

      <StatusChip
        icon={
          isConnected ? (
            <Wifi size={14} color="#265AB9" />
          ) : (
            <WifiOff size={14} color="#DC2626" />
          )
        }
        text={isConnected ? "Internet conectada" : "Sem conexão"}
        isOk={isConnected}
      />
    </View>
  )
}

import { Text, TouchableOpacity, View } from "react-native"
import { BookOpen, ChevronRight } from "lucide-react-native"
import { IconBadge } from "@/components/icon-badge"

interface ManualsCardProps {
  onPress: () => void
}

export function ManualsCard({ onPress }: ManualsCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="rounded-2xl bg-white p-4 shadow-sm shadow-black/5"
    >
      <View className="flex-row items-center justify-between">
        <IconBadge icon={<BookOpen size={18} color="#265AB9" />} />
        <ChevronRight size={18} color="#9CA3AF" />
      </View>
      <Text className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-signup-gray">
        Documentação
      </Text>
      <Text className="mt-1 text-lg font-extrabold text-signup-text">
        Manuais do aplicativo
      </Text>
      <Text className="mt-1 text-[11px] text-signup-gray">
        Entrega · Segurança · Emergência
      </Text>
    </TouchableOpacity>
  )
}

import { ReactNode } from "react"
import {
  ActivityIndicator,
  Modal as RNModal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { X } from "lucide-react-native"

interface CustomModalProps {
  modalVisible: boolean
  icon: ReactNode
  title: string
  loading?: boolean
  description?: string
  onPressOk: () => void
  onPressCancel?: () => void
  onClose?: () => void
  titleButton?: string
  labelSecundary?: string
  cancelLabel?: string
}

export function CustomModal({
  icon,
  title,
  onPressOk,
  loading,
  description,
  onPressCancel,
  onClose,
  modalVisible,
  titleButton,
  labelSecundary,
  cancelLabel,
}: CustomModalProps) {
  const closeAction = onClose || onPressCancel

  return (
    <RNModal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={closeAction}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        {closeAction ? (
          <Pressable
            className="absolute inset-0"
            onPress={closeAction}
            accessibilityRole="button"
            accessibilityLabel="Fechar modal"
          />
        ) : null}
        <View className="mx-6 w-full max-w-sm">
          <View className="items-center mb-[-26px] z-20">
            <View className="rounded-full">{icon}</View>
          </View>
          <View className="rounded-3xl pt-10 pb-6 px-6 bg-tourism-forest">
            {closeAction ? (
              <TouchableOpacity
                activeOpacity={0.7}
                className="absolute right-3 top-3 h-10 w-10 rounded-full items-center justify-center bg-white/10"
                onPress={closeAction}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
              >
                <X size={18} color="#F4EDE0" />
              </TouchableOpacity>
            ) : null}
            <View className="items-center mb-6">
              <Text className="font-sans-bold text-xl mb-2 text-center text-tourism-sand">
                {title}
              </Text>
              {description ? (
                <Text className="text-center font-sans text-sm leading-5 text-tourism-mist">
                  {description}
                </Text>
              ) : null}
            </View>
            <View className="flex-row">
              {onPressCancel ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-1 mr-3 py-3.5 px-4 rounded-full items-center bg-white/10"
                    onPress={onPressCancel}
                    disabled={loading}
                  >
                    <Text className="font-sans-medium text-sm text-tourism-sand">
                      {cancelLabel || "Cancelar"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-1 py-3.5 px-4 rounded-full items-center bg-tourism-ember"
                    onPress={onPressOk}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#F4EDE0" />
                    ) : (
                      <Text className="font-sans-medium text-sm text-tourism-sand">
                        {labelSecundary || "OK"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="w-full py-3.5 px-4 rounded-full items-center bg-tourism-ember"
                  onPress={onPressOk}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#F4EDE0" />
                  ) : (
                    <Text className="font-sans-medium text-sm text-tourism-sand">
                      {titleButton || "OK"}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  )
}

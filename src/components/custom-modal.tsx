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
            <View className="shadow-lg shadow-black/25 rounded-full">{icon}</View>
          </View>
          <View className="rounded-3xl shadow-2xl pt-10 pb-6 px-6 bg-white">
            {closeAction ? (
              <TouchableOpacity
                activeOpacity={0.7}
                className="absolute right-3 top-3 h-10 w-10 rounded-full items-center justify-center bg-black/5"
                onPress={closeAction}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
              >
                <X size={18} color="#2A2A2A" />
              </TouchableOpacity>
            ) : null}
            <View className="items-center mb-6">
              <Text className="text-xl font-bold mb-2 text-center text-signup-text">
                {title}
              </Text>
              {description ? (
                <Text className="text-center text-sm leading-5 text-signup-text/70">
                  {description}
                </Text>
              ) : null}
            </View>
            <View className="flex-row">
              {onPressCancel ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-1 mr-3 py-3.5 px-4 rounded-xl items-center bg-[#e5e7eb]"
                    onPress={onPressCancel}
                    disabled={loading}
                  >
                    <Text className="font-medium text-sm text-signup-text">
                      {cancelLabel || "Cancelar"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-1 py-3.5 px-4 rounded-xl items-center bg-signup-primary"
                    onPress={onPressOk}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="font-medium text-sm text-white">
                        {labelSecundary || "OK"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="w-full py-3.5 px-4 rounded-xl items-center bg-signup-primary"
                  onPress={onPressOk}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="font-medium text-sm text-white">
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

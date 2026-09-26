import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native"
import { Control, FieldErrors } from "react-hook-form"
import { ShieldAlert, UserRound } from "lucide-react-native"
import { TourismButton } from "@/components/tourism-button"
import { InputControl } from "@/components/input-control"
import { maskCpf } from "@/shared/utils/formatters"
import { SignInFormData } from "@/shared/viewmodels/sign-in/sign-in-schema"

interface SessionReauthModalProps {
  modalVisible: boolean
  control: Control<SignInFormData>
  errors: FieldErrors<SignInFormData>
  isSubmitting: boolean
  errorMessage: string | null
  onSubmit: () => void
  onClose: () => void
}

export function SessionReauthModal({
  modalVisible,
  control,
  errors,
  isSubmitting,
  errorMessage,
  onSubmit,
  onClose,
}: SessionReauthModalProps) {
  return (
    <RNModal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center bg-black/60">
          <Pressable
            className="absolute inset-0"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar modal"
          />

          <View className="mx-6 w-full max-w-sm">
            <View className="z-20 mb-[-26px] items-center">
              <View className="rounded-full">
                <ShieldAlert size={32} color="#B91C1C" />
              </View>
            </View>

            <View className="rounded-3xl bg-tourism-forest px-6 pb-6 pt-10">
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View className="mb-5 items-center">
                  <Text className="mb-2 text-center font-sans-bold text-xl text-tourism-sand">
                    Sessão expirada
                  </Text>
                  <Text className="text-center font-sans text-sm leading-5 text-tourism-mist">
                    Sua sessão terminou. Informe seu CPF e senha para
                    continuar.
                  </Text>
                </View>

                {errorMessage ? (
                  <View className="mb-4 rounded-lg bg-red-100 px-3 py-2">
                    <Text className="text-sm font-medium text-red-600">
                      {errorMessage}
                    </Text>
                  </View>
                ) : null}

                <InputControl
                  tone="dark"
                  isRequire
                  label="Seu CPF"
                  name="ssn"
                  control={control}
                  mask={maskCpf}
                  keyboardType="numeric"
                  maxLength={14}
                  placeholder="Digite seu CPF"
                  error={errors.ssn?.message}
                  icon={<UserRound size={18} color="#A9B5AE" />}
                />

                <InputControl
                  tone="dark"
                  isRequire
                  label="Sua senha"
                  name="password"
                  control={control}
                  placeholder="Digite sua senha"
                  error={errors.password?.message}
                  secury
                />

                <TourismButton
                  variant="ember"
                  className="mt-2"
                  label={isSubmitting ? "Entrando..." : "Entrar de novo"}
                  onPress={onSubmit}
                  isLoading={isSubmitting}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  )
}

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
import { Button } from "@/components/button"
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
              <View className="rounded-full shadow-lg shadow-black/25">
                <ShieldAlert size={32} color="#B91C1C" />
              </View>
            </View>

            <View className="rounded-3xl bg-white px-6 pb-6 pt-10 shadow-2xl">
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View className="mb-5 items-center">
                  <Text className="mb-2 text-center text-xl font-bold text-signup-text">
                    Sessão expirada
                  </Text>
                  <Text className="text-center text-sm leading-5 text-signup-text/70">
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
                  isRequire
                  label="Seu CPF"
                  name="ssn"
                  control={control}
                  mask={maskCpf}
                  keyboardType="numeric"
                  maxLength={14}
                  placeholder="Digite seu CPF"
                  error={errors.ssn?.message}
                  icon={<UserRound size={18} color="#6B7280" />}
                />

                <InputControl
                  isRequire
                  label="Sua senha"
                  name="password"
                  control={control}
                  placeholder="Digite sua senha"
                  error={errors.password?.message}
                  secury
                />

                <Button
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

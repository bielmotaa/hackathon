import { FC } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native"
import { Link } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { UserRound } from "lucide-react-native"
import { Button } from "@/components/button"
import { InputControl } from "@/components/input-control"
import { maskCpf } from "@/shared/utils/formatters"
import { useSignInViewModel } from "./sign-in-view-model"

const iconColor = "#6B7280"

export const SignInViewUi: FC<ReturnType<typeof useSignInViewModel>> = ({
  control,
  errors,
  isSubmitting,
  handleSubmit,
}) => {
  return (
    <View className="flex-1 bg-signup-primary">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="relative overflow-hidden px-6 pb-10 pt-20">
            <View
              pointerEvents="none"
              className="absolute -right-14 -top-16"
            >
              <View className="h-56 w-56 rounded-full border border-white/10" />
              <View className="absolute left-14 top-14 h-32 w-32 rounded-full border-2 border-white/20" />
              <View className="absolute left-24 top-24 h-14 w-14 rounded-full bg-white/10" />
            </View>

            <Text className="text-[11px] font-semibold tracking-[2px] text-white/50">
              DEFESA CIVIL
            </Text>
            <Text className="mt-1 text-3xl font-extrabold text-white">
              Defesa e Ação
            </Text>
          </View>

          <View className="mt-12 w-full flex-1 rounded-t-3xl bg-signup-background p-5 pb-8">
            <View className="m-2 mb-6">
              <Text className="text-base text-signup-gray">Seja bem-vindo</Text>
              <Text className="mt-1 text-3xl font-extrabold leading-tight text-gray-900">
                Acessar conta
              </Text>
            </View>

            <InputControl
              isRequire
              label="Informe seu CPF"
              name="ssn"
              control={control}
              mask={maskCpf}
              keyboardType="numeric"
              maxLength={14}
              placeholder="Digite seu CPF"
              error={errors.ssn?.message}
              icon={<UserRound size={18} color={iconColor} />}
            />

            <InputControl
              isRequire
              label="Informe sua senha"
              name="password"
              control={control}
              placeholder="Digite sua senha"
              error={errors.password?.message}
              secury
            />

            <Text className="mb-4 mt-1 text-right text-sm text-signup-gray">
              Esqueceu sua senha?
            </Text>

            <Button
              label={isSubmitting ? "Entrando..." : "Entrar"}
              onPress={handleSubmit}
              isLoading={isSubmitting}
            />

            <Text className="mt-6 text-center text-sm text-signup-text">
              Ainda não tem conta?
              <Link href="/sign-up">
                <Text className="text-sm font-semibold text-signup-primary">
                  {" "}
                  Criar uma
                </Text>
              </Link>
            </Text>

            <Text className="mt-auto mb-10 text-center text-[11px] text-signup-gray/50">
              Criado por DDS — Departamento de Desenvolvimento {'\n'} de Sistemas
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

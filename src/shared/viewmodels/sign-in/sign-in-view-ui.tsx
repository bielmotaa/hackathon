import { FC } from "react"
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { UserRound } from "lucide-react-native"
import { InputControl } from "@/components/input-control"
import { TourismButton } from "@/components/tourism-button"
import { maskCpf } from "@/shared/utils/formatters"
import { useSignInViewModel } from "./sign-in-view-model"

const heroImage = require("@/shared/assets/background_login.jpg")

export const SignInViewUi: FC<ReturnType<typeof useSignInViewModel>> = ({
  control,
  errors,
  isSubmitting,
  handleSubmit,
}) => {
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const heroHeight = Math.min(Math.max(height * 0.38, 280), 380)

  return (
    <View className="flex-1 bg-tourism-night">
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
          <ImageBackground
            source={heroImage}
            resizeMode="cover"
            style={{ height: heroHeight }}
          >
            <View
              className="flex-1 justify-between bg-black/40 px-6 pb-14"
              style={{ paddingTop: insets.top + 16 }}
            >
              <Text className="font-sans-bold text-lg tracking-[5px] text-tourism-sand">
                TURISMO IA
              </Text>
              <View>
                <Text className="font-sans-medium text-sm text-tourism-sand/80">
                  Bem-vindo de volta
                </Text>
                <Text className="mt-1 font-sans-bold text-3xl tracking-tight text-tourism-sand">
                  Para onde vamos hoje?
                </Text>
              </View>
            </View>
          </ImageBackground>

          <View
            className="-mt-8 flex-1 rounded-t-[32px] bg-tourism-night px-6 pt-8"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <InputControl
              tone="dark"
              label="CPF do viajante"
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
              label="Senha"
              name="password"
              control={control}
              placeholder="Digite sua senha"
              error={errors.password?.message}
              secury
            />

            <Text className="mb-6 text-right font-sans text-sm text-tourism-mist">
              Esqueceu sua senha?
            </Text>

            <TourismButton
              variant="ember"
              label={isSubmitting ? "Entrando..." : "Começar a explorar"}
              onPress={handleSubmit}
              isLoading={isSubmitting}
            />

            <Text className="mt-auto pt-10 text-center font-sans text-xs text-tourism-mist/60">
              Descubra destinos, monte roteiros e viaje com a ajuda da IA.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

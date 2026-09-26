import { FC } from "react"
import { ImageBackground, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { ArrowRight } from "lucide-react-native"
import { TourismButton } from "@/components/tourism-button"
import { useOnboardingViewModel } from "./onboarding-view-model"

const backgroundImage = require("@/shared/assets/background_login.jpg")

export const OnboardingViewUi: FC<ReturnType<typeof useOnboardingViewModel>> = ({
  brand,
  tagline,
  headline,
  description,
  onNext,
}) => {
  const insets = useSafeAreaInsets()

  return (
    <ImageBackground source={backgroundImage} resizeMode="cover" className="flex-1">
      <StatusBar style="light" />
      <View
        className="flex-1 justify-between bg-black/30 px-6"
        style={{ paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }}
      >
        <View className="items-center">
          <Text className="font-sans-bold text-xl tracking-[6px] text-tourism-sand">
            {brand}
          </Text>
          <Text className="mt-2 text-center font-sans-medium text-xs tracking-[2px] text-tourism-sand/70">
            {tagline}
          </Text>
        </View>

        <View>
          <Text className="font-sans-bold text-4xl tracking-tight text-tourism-sand">
            {headline}
          </Text>
          <View className="mb-5 mt-4 h-[3px] w-20 rounded-full bg-tourism-ember" />
          <Text className="mb-8 font-sans text-base text-tourism-sand/80">
            {description}
          </Text>
          <TourismButton
            label="Próximo"
            onPress={onNext}
            icon={<ArrowRight size={18} color="#0F1613" />}
          />
        </View>
      </View>
    </ImageBackground>
  )
}

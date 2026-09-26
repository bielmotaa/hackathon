import { FC } from "react"
import { ImageBackground, Text, View } from "react-native"
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
  return (
    <ImageBackground source={backgroundImage} resizeMode="cover" className="flex-1">
      <StatusBar style="light" />
      <View className="flex-1 justify-between bg-black/30 px-7 pb-10 pt-20">
        <View className="items-center">
          <Text className="font-display text-3xl tracking-[10px] text-tourism-sand">
            {brand}
          </Text>
          <Text className="mt-2 font-sans-medium text-[10px] tracking-[3px] text-tourism-sand/70">
            {tagline}
          </Text>
        </View>

        <View>
          <Text className="font-display text-5xl leading-[52px] text-tourism-sand">
            {headline}
          </Text>
          <View className="mb-5 mt-3 h-[3px] w-24 rounded-full bg-tourism-ember" />
          <Text className="mb-8 font-sans text-base leading-6 text-tourism-sand/80">
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

import { router } from "expo-router"

export const useOnboardingViewModel = () => ({
  brand: "TURISMO IA",
  tagline: "EXPLORE · PLANEJE · DESCUBRA",
  headline: "O mundo está\nesperando por você",
  description:
    "Roteiros e destinos sob medida, criados pela inteligência artificial para a sua próxima viagem.",
  onNext: () => router.push("/sign-in"),
})

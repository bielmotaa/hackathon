import { useForm } from "react-hook-form"
import { router } from "expo-router"
import { useUserStore } from "@/shared/store/user/user-store"
import { MOCK_PROFILE_USER } from "@/shared/mocks/profile-mock"
import { SignInFormData } from "./sign-in-schema"

// Login de demonstração: entra direto no app, sem chamar a API.
// Trocar por signIn/getUserProfile (auths.service) quando a API for integrada.
export const useSignInViewModel = () => {
  const setSession = useUserStore((state) => state.setSession)

  const {
    control,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: { ssn: "", password: "" },
  })

  const handleSubmit = () => {
    setSession({ token: "mock-token", refreshToken: null, UserData: MOCK_PROFILE_USER })
    router.replace("/(private)/home")
  }

  return {
    control,
    errors,
    isSubmitting: false,
    handleSubmit,
  }
}

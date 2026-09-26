import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert } from "react-native"
import { router } from "expo-router"
import { isAxiosError } from "axios"
import { getUserProfile, signIn } from "@/shared/services/auths.service"
import { useUserStore } from "@/shared/store/user/user-store"
import { REGISTER_APPLICATION_ID } from "@/shared/constants/register-application"
import { signInSchema, SignInFormData } from "./sign-in-schema"

export const useSignInViewModel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setSession = useUserStore((state) => state.setSession)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { ssn: "", password: "" },
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsSubmitting(true)

      const loginResponse = await signIn({
        ssn: data.ssn.replace(/\D/g, ""),
        password: data.password,
        applicationId: REGISTER_APPLICATION_ID,
      })

      const profile = await getUserProfile(
        loginResponse.userId,
        loginResponse.applicationId
      )

      setSession({
        token: loginResponse.accessToken,
        refreshToken: null,
        UserData: {
          id: profile.id,
          name: profile.name,
          ssn: profile.ssn,
          email: profile.email,
          phone: profile.phone,
          birthDate: profile.birthDate,
          userName: profile.userName,
          rg: profile.rg,
          gender: profile.gender,
          avatarPath: profile.avatarPath,
          cityName: profile.cityName,
          secretariatName: profile.secretariatName,
          roleName: profile.roleName,
          roleId: loginResponse.roleId,
          applicationId: loginResponse.applicationId,
          secretariatId: loginResponse.secretariatId,
          cityId: loginResponse.cityId,
          createdAt: profile.createdAt,
        },
      })

      router.replace("/(private)/home")
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined

      Alert.alert(
        "Não foi possível entrar",
        message ?? "Verifique seu CPF e senha e tente novamente."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    control,
    errors,
    isSubmitting,
    handleSubmit: handleSubmit(onSubmit),
  }
}

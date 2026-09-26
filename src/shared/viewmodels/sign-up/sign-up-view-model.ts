import { useState } from "react"
import { router } from "expo-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert } from "react-native"
import { useRegisterMutation } from "@/shared/queries/auth/user-register.mutation"
import { useCitiesQuery } from "@/shared/queries/common/cities.query"
import { useSecretariatsQuery } from "@/shared/queries/common/secretariats.query"
import { RegisterHttpParams } from "@/shared/interfaces/http/sign-in-interface"
import { formatDateOfBirthToISO } from "@/shared/utils/formatters"
import { REGISTER_APPLICATION_ID, REGISTER_ROLE_ID } from "@/shared/constants/register-application"
import { signUpSchema, SignUpFormData } from "./sign-up-schema"

export const useSignUpViewModel = () => {
  const [checkPrivacy, setCheckPrivacy] = useState(false)
  const registerMutation = useRegisterMutation()
  const citiesQuery = useCitiesQuery()
  const secretariatsQuery = useSecretariatsQuery()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const cities = (citiesQuery.data ?? []).map((city) => ({
    label: city.name,
    value: city.id,
  }))

  const secretariats = (secretariatsQuery.data ?? []).map((secretariat) => ({
    label: secretariat.name,
    value: secretariat.id,
  }))

  const [currentModal, setCurrentModal] = useState<"none" | "success" | "error">("none")

  async function onSubmit(data: SignUpFormData) {
    if (!checkPrivacy) {
      Alert.alert(
        "Atenção",
        "Você precisa aceitar a Política de Privacidade e os Termos de Uso."
      )
      return
    }

    const payload: RegisterHttpParams = {
      name: data.name,
      email: data.email,
      password: data.password,
      ssn: data.ssn.replace(/\D/g, ""),
      birthDate: formatDateOfBirthToISO(data.birthDate),
      phone: data.phone ? data.phone.replace(/\D/g, "") : undefined,
      gender: data.gender,
      userTerms: checkPrivacy,
      cityId: data.cityId,
      street: data.street,
      secretariatId: data.secretariatId,
      applicationId: REGISTER_APPLICATION_ID,
      roleId: REGISTER_ROLE_ID,
    }

    try {
      await registerMutation.mutateAsync(payload)
      setCurrentModal("success")
    } catch (error) {
      setCurrentModal("error")
    }
  }

  const closeSuccessModal = () => {
    setCurrentModal("none")
    router.replace("/sign-in")
  }

  const closeErrorModal = () => {
    setCurrentModal("none")
  }

  return {
    control,
    errors,
    isSubmitting,
    cities,
    isLoadingCities: citiesQuery.isLoading,
    secretariats,
    isLoadingSecretariats: secretariatsQuery.isLoading,
    checkPrivacy,
    setCheckPrivacy,
    handleSubmit: handleSubmit(onSubmit),
    isSuccessModalVisible: currentModal === "success",
    isErrorModalVisible: currentModal === "error",
    closeSuccessModal,
    closeErrorModal,
  }
}

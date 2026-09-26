import { useCallback, useEffect, useState } from "react"
import { AppState } from "react-native"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { router } from "expo-router"
import { getUserProfile, signIn } from "@/shared/services/auths.service"
import { useUserStore } from "@/shared/store/user/user-store"
import {
  signInSchema,
  SignInFormData,
} from "@/shared/viewmodels/sign-in/sign-in-schema"

const SESSION_CHECK_INTERVAL = 300000

export const useSessionViewModel = () => {
  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)
  const updateTokens = useUserStore((state) => state.updateTokens)

  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const [isReauthModalVisible, setIsReauthModalVisible] = useState(false)
  const [isReauthSubmitting, setIsReauthSubmitting] = useState(false)
  const [reauthError, setReauthError] = useState<string | null>(null)
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false)

  const {
    control: reauthControl,
    handleSubmit: handleReauthSubmit,
    reset: resetReauthForm,
    formState: { errors: reauthErrors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { ssn: "", password: "" },
  })

  const checkSession = useCallback(async () => {
    if (!user?.id || !user?.applicationId) return

    try {
      await getUserProfile(user.id, user.applicationId)
      setIsSessionExpired(false)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setIsSessionExpired(true)
      }
    }
  }, [user?.id, user?.applicationId])

  useEffect(() => {
    checkSession()

    const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL)
    const subscription = AppState.addEventListener("change", (status) => {
      if (status === "active") checkSession()
    })

    return () => {
      clearInterval(interval)
      subscription.remove()
    }
  }, [checkSession])

  const openReauthModal = useCallback(() => {
    setReauthError(null)
    resetReauthForm({ ssn: user?.ssn ?? "", password: "" })
    setIsReauthModalVisible(true)
  }, [resetReauthForm, user?.ssn])

  const closeReauthModal = useCallback(() => {
    setReauthError(null)
    setIsReauthModalVisible(false)
  }, [])

  const reauthenticate = useCallback(
    async (data: SignInFormData) => {
      try {
        setIsReauthSubmitting(true)
        setReauthError(null)

        const response = await signIn({
          ssn: data.ssn.replace(/\D/g, ""),
          password: data.password,
          applicationId: user?.applicationId ?? "",
        })

        updateTokens({ token: response.accessToken, refreshToken: null })
        setIsSessionExpired(false)
        setIsReauthModalVisible(false)
      } catch (error) {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : undefined

        setReauthError(message ?? "CPF ou senha inválidos. Tente novamente.")
      } finally {
        setIsReauthSubmitting(false)
      }
    },
    [updateTokens, user?.applicationId]
  )

  const handleLogout = useCallback(() => {
    logout()
    router.replace("/sign-in")
  }, [logout])

  const openLogoutModal = useCallback(() => setIsLogoutModalVisible(true), [])
  const closeLogoutModal = useCallback(() => setIsLogoutModalVisible(false), [])

  const confirmLogout = useCallback(() => {
    setIsLogoutModalVisible(false)
    handleLogout()
  }, [handleLogout])

  return {
    isSessionExpired,
    isReauthModalVisible,
    openReauthModal,
    closeReauthModal,
    reauthControl,
    reauthErrors,
    isReauthSubmitting,
    reauthError,
    handleReauthSubmit: handleReauthSubmit(reauthenticate),

    isLogoutModalVisible,
    openLogoutModal,
    closeLogoutModal,
    confirmLogout,
  }
}

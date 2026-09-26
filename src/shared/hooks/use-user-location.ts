import { useEffect } from "react"
import { AppState, Linking } from "react-native"
import * as Location from "expo-location"
import { create } from "zustand"

export interface Coordinates {
  latitude: number
  longitude: number
}

export type UserLocationStatus = "locating" | "ready" | "denied" | "error"

interface LocationState {
  coords?: Coordinates
  status: UserLocationStatus
  canAskAgain: boolean
}

// Estado e acompanhamento únicos: Home e mapa compartilham a mesma assinatura do GPS.
const useLocationStore = create<LocationState>(() => ({ status: "locating", canAskAgain: true }))

let subscribers = 0
let subscription: Location.LocationSubscription | undefined
let session = 0

const stopWatching = () => {
  session += 1
  subscription?.remove()
  subscription = undefined
}

// Acompanha a posição enquanto o app está aberto (sem rastreamento em segundo plano).
const startWatching = async () => {
  stopWatching()
  const current = session

  try {
    useLocationStore.setState({ status: "locating" })
    const permission = await Location.requestForegroundPermissionsAsync()
    if (current !== session) return

    if (permission.status !== "granted") {
      useLocationStore.setState({ status: "denied", canAskAgain: permission.canAskAgain })
      return
    }

    if (!(await Location.hasServicesEnabledAsync())) {
      if (current === session) useLocationStore.setState({ status: "error" })
      return
    }

    const watcher = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 50, timeInterval: 10000 },
      ({ coords: { latitude, longitude } }) => {
        useLocationStore.setState({ coords: { latitude, longitude }, status: "ready" })
      }
    )

    if (current === session) subscription = watcher
    else watcher.remove()
  } catch {
    if (current === session) useLocationStore.setState({ status: "error" })
  }
}

let appStateListener: ReturnType<typeof AppState.addEventListener> | undefined

const startSharedWatching = () => {
  startWatching()

  // Ao voltar das configurações do sistema, tenta de novo se a localização estava indisponível.
  appStateListener = AppState.addEventListener("change", (state) => {
    const { status } = useLocationStore.getState()
    if (state === "active" && (status === "denied" || status === "error")) startWatching()
  })
}

const stopSharedWatching = () => {
  stopWatching()
  appStateListener?.remove()
  appStateListener = undefined
}

export const useUserLocation = () => {
  const { coords, status, canAskAgain } = useLocationStore()

  useEffect(() => {
    subscribers += 1
    if (subscribers === 1) startSharedWatching()

    return () => {
      subscribers -= 1
      if (subscribers === 0) stopSharedWatching()
    }
  }, [])

  return { coords, status, canAskAgain, retry: startWatching }
}

// Aviso (com ação) quando a localização não está disponível; null quando está tudo certo.
export const getLocationIssue = (location: ReturnType<typeof useUserLocation>) => {
  if (location.status === "denied") {
    return {
      state: "empty" as const,
      message: "Permita o acesso à localização para ver lugares perto de você.",
      actionLabel: "Permitir localização",
      onAction: location.canAskAgain ? location.retry : () => Linking.openSettings(),
    }
  }
  if (location.status === "error") {
    return {
      state: "error" as const,
      message: "Não foi possível obter sua localização. Verifique se o GPS está ligado.",
      actionLabel: undefined,
      onAction: location.retry,
    }
  }
  return null
}

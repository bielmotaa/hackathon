import { useCallback, useEffect, useState } from "react"
import { AppState, Linking, Platform } from "react-native"
import * as Location from "expo-location"

function openDeviceSettings() {
  if (Platform.OS === "ios") {
    return Linking.openURL("app-settings:")
  }

  return Linking.openSettings()
}

export function useLocationPermission() {
  const [status, setStatus] = useState<Location.PermissionStatus | null>(null)

  const refreshPermission = useCallback(async () => {
    const permission = await Location.getForegroundPermissionsAsync()
    setStatus(permission.status)
    return permission
  }, [])

  useEffect(() => {
    refreshPermission()

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshPermission()
    })

    return () => subscription.remove()
  }, [refreshPermission])

  const requestAccess = useCallback(async () => {
    if (status === Location.PermissionStatus.UNDETERMINED || status === null) {
      const permission = await Location.requestForegroundPermissionsAsync()
      setStatus(permission.status)
      return
    }

    await openDeviceSettings()
  }, [status])

  return {
    isGranted: status === Location.PermissionStatus.GRANTED,
    requestAccess,
  }
}

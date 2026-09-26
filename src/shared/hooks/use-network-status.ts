import { useEffect, useState } from "react"
import NetInfo from "@react-native-community/netinfo"

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true)

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(Boolean(state.isConnected))
    })

    return NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected))
    })
  }, [])

  return { isConnected }
}

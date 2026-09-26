import { useEffect, useState } from "react"
import { Redirect } from "expo-router"
import { useUserStore } from "@/shared/store/user/user-store"

export default function App() {
  const [hasHydrated, setHasHydrated] = useState(
    useUserStore.persist.hasHydrated()
  )
  const token = useUserStore((state) => state.token)

  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) {
      setHasHydrated(true)
      return
    }

    return useUserStore.persist.onFinishHydration(() => setHasHydrated(true))
  }, [])

  if (!hasHydrated) {
    return null
  }

  return <Redirect href={token ? "/(private)/home" : "/onboarding"} />
}

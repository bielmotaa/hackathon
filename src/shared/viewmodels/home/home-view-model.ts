import { useMemo } from "react"
import { useLocationPermission } from "@/shared/hooks/use-location-permission"
import { useNetworkStatus } from "@/shared/hooks/use-network-status"
import { useUserStore } from "@/shared/store/user/user-store"
import { useSessionViewModel } from "@/shared/viewmodels/session/session-view-model"

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

const WEEKDAYS_SHORT = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]

function formatFullDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0")
  return `${day} ${MONTHS[date.getMonth()]}`
}

function buildDayWindow(reference: Date) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(reference)
    date.setDate(reference.getDate() + (index - 3))

    return {
      date,
      dayNumber: date.getDate(),
      weekdayLabel: WEEKDAYS_SHORT[date.getDay()],
      isToday: date.toDateString() === reference.toDateString(),
    }
  })
}

const MOCK_WEATHER = {
  city: "Manaus",
  condition: "Parcialmente nublado",
  temperature: 31,
  min: 24,
  max: 33,
}

export const useHomeViewModel = () => {
  const user = useUserStore((state) => state.user)
  const session = useSessionViewModel()
  const { isConnected } = useNetworkStatus()
  const { isGranted: isLocationGranted, requestAccess } =
    useLocationPermission()

  const today = useMemo(() => new Date(), [])
  const days = useMemo(() => buildDayWindow(today), [today])
  const formattedDate = useMemo(() => formatFullDate(today), [today])
  const firstName = user?.name?.trim().split(" ")[0] ?? ""

  return {
    firstName,
    formattedDate,
    days,
    weather: MOCK_WEATHER,
    deliveriesCount: null as number | null,
    onPressRealizarEntrega: () => {},
    onPressManuals: () => {},
    isConnected: Boolean(isConnected),
    isLocationGranted,
    onPressLocation: requestAccess,
    ...session,
  }
}

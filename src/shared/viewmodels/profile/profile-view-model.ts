import { useSessionViewModel } from "@/shared/viewmodels/session/session-view-model"
import { formatPhoneNumber } from "@/shared/utils/formatters"
import {
  MOCK_PROFILE_STATS,
  MOCK_PROFILE_USER,
  MOCK_TRAVEL_INTERESTS,
} from "@/shared/mocks/profile-mock"

export type ProfileFieldKey =
  | "name"
  | "birthDate"
  | "city"
  | "phone"
  | "email"
  | "memberSince"

interface ProfileField {
  key: ProfileFieldKey
  label: string
  value: string
}

function getInitials(name?: string) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? []

  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?"

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function formatDate(iso?: string) {
  if (!iso) return undefined
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return undefined

  const day = String(date.getUTCDate()).padStart(2, "0")
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  return `${day}/${month}/${date.getUTCFullYear()}`
}

function onlyAvailable(
  fields: { key: ProfileFieldKey; label: string; value?: string }[]
) {
  return fields.filter(
    (field): field is ProfileField =>
      typeof field.value === "string" && field.value.trim().length > 0
  )
}

export const useProfileViewModel = () => {
  const user = MOCK_PROFILE_USER
  const session = useSessionViewModel()

  const aboutFields = onlyAvailable([
    { key: "name", label: "Nome", value: user.name },
    { key: "birthDate", label: "Data de nascimento", value: formatDate(user.birthDate) },
    { key: "city", label: "Cidade", value: user.cityName },
  ])

  const contactFields = onlyAvailable([
    {
      key: "phone",
      label: "Telefone",
      value: user.phone ? formatPhoneNumber(user.phone) : undefined,
    },
    { key: "email", label: "E-mail", value: user.email },
  ])

  const accountFields = onlyAvailable([
    { key: "memberSince", label: "Viajante desde", value: formatDate(user.createdAt) },
  ])

  return {
    name: user.name,
    email: user.email,
    initials: getInitials(user.name),
    stats: MOCK_PROFILE_STATS,
    interests: MOCK_TRAVEL_INTERESTS,
    sections: [
      { title: "Sobre você", fields: aboutFields },
      { title: "Contato", fields: contactFields },
      { title: "Sua conta", fields: accountFields },
    ].filter((section) => section.fields.length > 0),
    ...session,
  }
}

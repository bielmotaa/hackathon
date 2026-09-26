import { useUserStore } from "@/shared/store/user/user-store"
import { useSessionViewModel } from "@/shared/viewmodels/session/session-view-model"
import { maskCpf, formatPhoneNumber } from "@/shared/utils/formatters"

export type ProfileFieldKey =
  | "name"
  | "birthDate"
  | "gender"
  | "cpf"
  | "rg"
  | "userName"
  | "phone"
  | "email"
  | "city"
  | "secretariat"
  | "role"
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

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${day}/${month}/${date.getFullYear()}`
}

function calculateAge(iso?: string) {
  if (!iso) return undefined
  const birthDate = new Date(iso)
  if (Number.isNaN(birthDate.getTime())) return undefined

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())

  if (!hasHadBirthdayThisYear) age -= 1
  return age
}

function capitalize(value?: string) {
  if (!value) return undefined
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
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
  const user = useUserStore((state) => state.user)
  const session = useSessionViewModel()

  const birthDateLabel = formatDate(user?.birthDate)
  const age = calculateAge(user?.birthDate)
  const birthDateValue = birthDateLabel
    ? age !== undefined
      ? `${birthDateLabel} · ${age} anos`
      : birthDateLabel
    : undefined

  const personalFields = onlyAvailable([
    { key: "name", label: "Nome", value: user?.name },
    { key: "birthDate", label: "Data de nascimento", value: birthDateValue },
    { key: "gender", label: "Gênero", value: capitalize(user?.gender) },
    {
      key: "cpf",
      label: "CPF",
      value: user?.ssn ? maskCpf(user.ssn) : undefined,
    },
    { key: "rg", label: "RG", value: user?.rg },
    { key: "userName", label: "Nome de usuário", value: user?.userName },
  ])

  const contactFields = onlyAvailable([
    {
      key: "phone",
      label: "Telefone",
      value: user?.phone ? formatPhoneNumber(user.phone) : undefined,
    },
    { key: "email", label: "E-mail", value: user?.email },
  ])

  const institutionalFields = onlyAvailable([
    { key: "city", label: "Cidade", value: user?.cityName },
    { key: "secretariat", label: "Secretaria", value: user?.secretariatName },
    { key: "role", label: "Função", value: user?.roleName },
    {
      key: "memberSince",
      label: "Membro desde",
      value: formatDate(user?.createdAt),
    },
  ])

  return {
    name: user?.name ?? "",
    email: user?.email,
    initials: getInitials(user?.name),
    sections: [
      { title: "Dados pessoais", fields: personalFields },
      { title: "Contato", fields: contactFields },
      { title: "Institucional", fields: institutionalFields },
    ].filter((section) => section.fields.length > 0),
    ...session,
  }
}

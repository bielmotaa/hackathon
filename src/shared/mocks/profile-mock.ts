import { UserInterface } from "@/shared/interfaces/user"

// Dados de demonstração do Perfil. Remover quando o perfil vier da API/store.
export const MOCK_PROFILE_USER: UserInterface = {
  id: "mock-user",
  name: "Marina Albuquerque",
  ssn: "00000000000",
  email: "marina.albuquerque@email.com",
  phone: "92991234567",
  birthDate: "1994-08-17T00:00:00.000Z",
  cityName: "Manaus",
  roleId: "",
  applicationId: "",
  secretariatId: "",
  cityId: "",
  createdAt: "2025-03-10T00:00:00.000Z",
}

export const MOCK_PROFILE_STATS = [
  { label: "Viagens", value: "12" },
  { label: "Países", value: "5" },
  { label: "Favoritos", value: "28" },
]

export const MOCK_TRAVEL_INTERESTS = ["Praias", "Trilhas", "Gastronomia", "Cultura", "Natureza"]

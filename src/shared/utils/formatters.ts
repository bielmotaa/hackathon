export function maskCpf(value: string) {
  const cleanedValue = value.replace(/\D/g, "")

  if (cleanedValue.length > 11) {
    return value
  }

  return cleanedValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
}

export function isValidCPF(cpf: string): boolean {
  const cleanedCPF = cpf.replace(/\D/g, "")

  if (cleanedCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanedCPF)) {
    return false
  }

  let sum = 0
  let remainder: number

  for (let i = 1; i <= 9; i++) {
    sum += Number.parseInt(cleanedCPF.charAt(i - 1)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanedCPF.charAt(9))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += Number.parseInt(cleanedCPF.charAt(i - 1)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(cleanedCPF.charAt(10))) return false

  return true
}

export function formatPhoneNumber(value: string): string {
  const cleanedValue = value.replace(/\D/g, "")
  if (cleanedValue.length <= 2) return `(${cleanedValue}`
  if (cleanedValue.length <= 6) {
    return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2)}`
  }
  return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7, 11)}`
}

export function formatDateInputInput(value: string): string {
  const cleanedValue = value.replace(/\D/g, "")
  const limitedValue = cleanedValue.slice(0, 8)

  if (limitedValue.length <= 2) return limitedValue
  if (limitedValue.length <= 4) {
    return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`
  }

  const day = limitedValue.slice(0, 2)
  const month = limitedValue.slice(2, 4)
  const year = limitedValue.slice(4)

  const inputMonth = Number.parseInt(month)
  const inputDay = Number.parseInt(day)

  if (inputMonth > 12) {
    if (inputDay > 31) return `31/12/${year}`
    return `${day}/12/${year}`
  }
  if (inputDay > 31) return `31/${month}/${year}`

  return `${day}/${month}/${year}`
}

export function isValidDateOfBirth(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return false

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  return (
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day) &&
    date <= new Date()
  )
}

export function formatDateOfBirthToISO(value: string): string {
  const [day, month, year] = value.split("/")
  const now = new Date()
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ).toISOString()
}


// A API usa textos no lugar de null (ex.: "não informado", "confirmar").
export function informedValue(value?: string | null) {
  if (!value || /não informado|confirmar|não se aplica/i.test(value)) return undefined
  return value
}

export function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace(".", ",")} km`
}

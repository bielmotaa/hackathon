import { isAxiosError } from "axios"

export const getRequestErrorMessage = (error: unknown, subject: string) =>
  isAxiosError(error) && !error.response
    ? "Sem conexão. Verifique sua internet e tente novamente."
    : `Não foi possível carregar ${subject}.`

export type ViewState = "idle" | "loading" | "error" | "empty" | "success"

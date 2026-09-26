import { z } from "zod"

export const signInSchema = z.object({
  ssn: z.string().min(11, "Informe um CPF válido"),
  password: z.string().min(1, "Informe sua senha"),
})

export type SignInFormData = z.infer<typeof signInSchema>

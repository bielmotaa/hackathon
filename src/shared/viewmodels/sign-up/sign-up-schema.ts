import { z } from "zod"
import { isValidCPF, isValidDateOfBirth } from "@/shared/utils/formatters"

export const GENDER_OPTIONS = [
  { label: "Masculino", value: "MALE" },
  { label: "Feminino", value: "FEMALE" },
]

export const signUpSchema = z
  .object({
    name: z
      .string({ error: "Informe seu nome" })
      .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
      .max(50, { message: "O nome não pode ter mais de 50 caracteres." }),
    gender: z.string().optional(),
    secretariatId: z
      .string({ error: "Informe sua secretaria" })
      .min(1, "Informe sua secretaria"),
    ssn: z
      .string({ error: "Informe seu CPF" })
      .min(14, { message: "O CPF deve ter 11 dígitos" })
      .max(14, { message: "O CPF deve ter 11 dígitos" })
      .refine((value) => isValidCPF(value), { message: "CPF inválido" }),
    birthDate: z
      .string({ error: "Informe sua data de nascimento" })
      .min(10, { message: "Informe uma data válida" })
      .refine((value) => isValidDateOfBirth(value), {
        message: "Data de nascimento inválida",
      }),
    email: z.email({ error: "O email fornecido não é válido." }),
    phone: z.string().optional(),
    cityId: z.string({ error: "Informe sua cidade" }).min(1, "Informe sua cidade"),
    street: z
      .string({ error: "Informe seu endereço" })
      .min(1, "Informe seu endereço"),
    password: z
      .string({ error: "Informe uma senha" })
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres." })
      .max(50, { message: "A senha não pode ter mais de 50 caracteres." }),
    confirmPassword: z.string({ error: "Confirme sua senha" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  })

export type SignUpFormData = z.infer<typeof signUpSchema>

import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/shared/services/tourism.service"
import { CategoryHttpResponse } from "@/shared/interfaces/http/tourism-interface"

// Não é turismo: fica fora da navegação por categorias.
export const HIDDEN_CATEGORY_SLUGS = ["unidades_de_saude"]

const toCategoryOptions = (categories: CategoryHttpResponse[]) =>
  categories
    .filter((category) => !HIDDEN_CATEGORY_SLUGS.includes(category.slug))
    .map((category) => ({ id: category.slug, label: category.nome }))

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["tourism", "categories"],
    queryFn: getCategories,
    select: toCategoryOptions,
    retry: 1,
  })
}

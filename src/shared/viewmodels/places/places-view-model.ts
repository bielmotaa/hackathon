import { useEffect, useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import { useCategoriesQuery } from "@/shared/queries/tourism/categories.query"
import { usePlacesQuery } from "@/shared/queries/tourism/places.query"
import { getRequestErrorMessage, ViewState } from "@/shared/utils/request-error"

export const usePlacesViewModel = () => {
  const { category } = useLocalSearchParams<{ category?: string }>()
  const categoriesQuery = useCategoriesQuery()
  const [selectedId, setSelectedId] = useState(category)

  // A Home envia a categoria escolhida ao abrir "Ver todos".
  useEffect(() => {
    if (category) setSelectedId(category)
  }, [category])

  const categories = categoriesQuery.data ?? []
  const selectedCategory = selectedId ?? categories[0]?.id
  const placesQuery = usePlacesQuery(selectedCategory)
  const places = placesQuery.data?.pages.flatMap((page) => page.items) ?? []

  const state: ViewState = categoriesQuery.isError
    ? "error"
    : categoriesQuery.isPending
      ? "loading"
      : categories.length === 0
        ? "empty"
        : placesQuery.isPending
          ? "loading"
          : placesQuery.isError
            ? "error"
            : places.length === 0
              ? "empty"
              : "success"

  return {
    categories,
    selectedCategory,
    onPressPlace: (id: string) => router.push({ pathname: "/place/[id]", params: { id } }),
    onSelectCategory: setSelectedId,
    places,
    state,
    errorMessage: categoriesQuery.isError
      ? getRequestErrorMessage(categoriesQuery.error, "as categorias")
      : getRequestErrorMessage(placesQuery.error, "os lugares"),
    onRetry: () => (categoriesQuery.isError ? categoriesQuery.refetch() : placesQuery.refetch()),
    isFetchingMore: placesQuery.isFetchingNextPage,
    onEndReached: () => {
      if (placesQuery.hasNextPage && !placesQuery.isFetchingNextPage) placesQuery.fetchNextPage()
    },
  }
}

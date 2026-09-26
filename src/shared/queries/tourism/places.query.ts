import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { getPlacesByCategory } from "@/shared/services/tourism.service"

const PAGE_SIZE = 20

export const usePlacesQuery = (categorySlug?: string) => {
  return useInfiniteQuery({
    queryKey: ["tourism", "places", categorySlug],
    queryFn: ({ pageParam }) => getPlacesByCategory(categorySlug!, PAGE_SIZE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.offset + lastPage.limit < lastPage.total
        ? lastPage.offset + lastPage.limit
        : undefined,
    enabled: Boolean(categorySlug),
    retry: 1,
  })
}

// Todos os lugares de uma categoria de uma vez (as maiores têm ~25 pontos), para o mapa.
const MAP_PLACES_LIMIT = 100

export const useCategoryPlacesQuery = (categorySlug?: string) => {
  return useQuery({
    queryKey: ["tourism", "category-places", categorySlug],
    queryFn: () => getPlacesByCategory(categorySlug!, MAP_PLACES_LIMIT, 0),
    select: (page) => page.items,
    enabled: Boolean(categorySlug),
    retry: 1,
  })
}

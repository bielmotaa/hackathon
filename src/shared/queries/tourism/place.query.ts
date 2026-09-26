import { InfiniteData, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"
import { getPlaceById } from "@/shared/services/tourism.service"
import {
  NearbyPlacesHttpResponse,
  PlaceHttpResponse,
  PlacesPageHttpResponse,
} from "@/shared/interfaces/http/tourism-interface"

const DETAIL_STALE_TIME_MS = 5 * 60 * 1000

// As listas (categoria, Destaques, próximos e mapa) já trazem o Ponto completo, o mesmo que
// GET /pontos/{id} devolve. Reaproveita o que já está em cache para não pedir o lugar de novo.
const findCachedPlace = (queryClient: QueryClient, id: string) => {
  const cached = queryClient.getQueriesData({ queryKey: ["tourism"] })

  for (const [queryKey, data] of cached) {
    let places: PlaceHttpResponse[] = []

    if (queryKey[1] === "category-places") {
      places = (data as PlacesPageHttpResponse | undefined)?.items ?? []
    } else if (queryKey[1] === "places") {
      places = (data as InfiniteData<PlacesPageHttpResponse> | undefined)?.pages.flatMap((page) => page.items) ?? []
    } else if (queryKey[1] === "nearby") {
      places = (data as NearbyPlacesHttpResponse | undefined)?.items.map((item) => item.ponto) ?? []
    }

    const place = places.find((item) => item.id === id)
    if (place) return place
  }

  return undefined
}

export const usePlaceQuery = (id: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["tourism", "place", id],
    queryFn: () => getPlaceById(id),
    initialData: () => findCachedPlace(queryClient, id),
    staleTime: DETAIL_STALE_TIME_MS,
    retry: 1,
  })
}

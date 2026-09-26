import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Coordinates } from "@/shared/hooks/use-user-location"
import { getNearbyPlaces } from "@/shared/services/tourism.service"
import { NearbyPlacesHttpResponse } from "@/shared/interfaces/http/tourism-interface"
import { HIDDEN_CATEGORY_SLUGS } from "./categories.query"

export const RADIUS_KM = 5
// A API não filtra por categoria neste endpoint: busca mais e descarta o que não é turismo.
const FETCH_LIMIT = 100
const DISPLAY_LIMIT = 10

// ~110 m: a posição muda a toda hora, mas a lista só precisa refazer quando o usuário anda de fato.
const round = (value: number) => Math.round(value * 1000) / 1000

const toNearbyPlaces = (response: NearbyPlacesHttpResponse) =>
  response.items
    .filter(({ ponto }) => !HIDDEN_CATEGORY_SLUGS.includes(ponto.categoria_slug ?? ""))
    .slice(0, DISPLAY_LIMIT)
    .map(({ ponto, distancia_km }) => ({ place: ponto, distanceKm: distancia_km }))

export const useNearbyPlacesQuery = (coords?: Coordinates) => {
  return useQuery({
    queryKey: ["tourism", "nearby", coords && round(coords.latitude), coords && round(coords.longitude)],
    // Envia a posição arredondada (~110 m): menos dado pessoal trafegando (LGPD) e mesma chave do cache.
    queryFn: () =>
      getNearbyPlaces(
        { latitude: round(coords!.latitude), longitude: round(coords!.longitude) },
        RADIUS_KM,
        FETCH_LIMIT
      ),
    select: toNearbyPlaces,
    placeholderData: keepPreviousData,
    enabled: Boolean(coords),
    retry: 1,
  })
}

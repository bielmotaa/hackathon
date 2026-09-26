import { useMemo, useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import { useCategoriesQuery } from "@/shared/queries/tourism/categories.query"
import { useCategoryPlacesQuery } from "@/shared/queries/tourism/places.query"
import { PlaceHttpResponse } from "@/shared/interfaces/http/tourism-interface"
import { getLocationIssue, useUserLocation } from "@/shared/hooks/use-user-location"
import { distanceInKm } from "@/shared/utils/geo"
import { formatDistance, informedValue } from "@/shared/utils/formatters"
import { getRequestErrorMessage, ViewState } from "@/shared/utils/request-error"

// Informação de apoio do cartão: ingresso (quando for texto útil) ou o bairro.
const getHighlight = (place: PlaceHttpResponse) => {
  const price = informedValue(place.preco_ingresso)
  if (price && !price.startsWith("OSM:")) return `Ingresso: ${price}`

  const neighborhood = informedValue(place.localizacao?.bairro)
  return neighborhood ? `Bairro: ${neighborhood}` : undefined
}

export const useMapViewModel = () => {
  // Vindo do detalhe ("Ver no mapa"): categoria a carregar e lugar a focar.
  const params = useLocalSearchParams<{ category?: string; placeId?: string }>()
  const categoriesQuery = useCategoriesQuery()
  const [selectedId, setSelectedId] = useState<string | undefined>(params.category || undefined)

  const categories = categoriesQuery.data ?? []
  const selectedCategory = selectedId ?? categories[0]?.id
  const placesQuery = useCategoryPlacesQuery(selectedCategory)
  const location = useUserLocation()
  const [centerOnUserKey, setCenterOnUserKey] = useState(0)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(params.placeId || undefined)
  const [focusId, setFocusId] = useState<string | undefined>(params.placeId || undefined)

  // Lugares sem coordenadas não geram marcador.
  const mapPlaces = useMemo(
    () =>
      (placesQuery.data ?? []).flatMap((place) =>
        place.coordenadas
          ? [{ id: place.id, latitude: place.coordenadas.latitude, longitude: place.coordenadas.longitude }]
          : []
      ),
    [placesQuery.data]
  )

  // Só o resumo depende da posição: os marcadores não são refeitos a cada passo do usuário.
  const nearestLabel = useMemo(() => {
    if (!location.coords || mapPlaces.length === 0) return undefined
    const nearest = Math.min(...mapPlaces.map((place) => distanceInKm(location.coords!, place)))
    return `Mais próximo: ${formatDistance(nearest)}`
  }, [location.coords, mapPlaces])

  const selectedPlace = useMemo(() => {
    const place = placesQuery.data?.find((item) => item.id === selectedPlaceId)
    if (!place) return undefined

    return {
      id: place.id,
      name: place.nome,
      category: place.categoria,
      categorySlug: place.categoria_slug ?? undefined,
      imageUrl: place.imagem?.url ?? undefined,
      description: informedValue(place.descricao_curta),
      highlight: getHighlight(place),
      distance:
        location.coords && place.coordenadas
          ? formatDistance(distanceInKm(location.coords, place.coordenadas))
          : undefined,
    }
  }, [placesQuery.data, selectedPlaceId, location.coords])

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
            : mapPlaces.length === 0
              ? "empty"
              : "success"

  return {
    categories,
    selectedCategory,
    onSelectCategory: (id: string) => {
      setSelectedId(id)
      setSelectedPlaceId(undefined)
      setFocusId(undefined)
    },
    selectedPlace,
    focusId,
    onSelectPlace: setSelectedPlaceId,
    onOpenDetails: (id: string) => router.push({ pathname: "/place/[id]", params: { id } }),
    mapPlaces,
    userLocation: location.coords,
    locationIssue: getLocationIssue(location),
    nearestLabel,
    centerOnUserKey,
    onCenterOnUser: () => setCenterOnUserKey((key) => key + 1),
    state,
    errorMessage: categoriesQuery.isError
      ? getRequestErrorMessage(categoriesQuery.error, "as categorias")
      : getRequestErrorMessage(placesQuery.error, "os lugares"),
    onRetry: () => (categoriesQuery.isError ? categoriesQuery.refetch() : placesQuery.refetch()),
    onBack: () => router.back(),
  }
}

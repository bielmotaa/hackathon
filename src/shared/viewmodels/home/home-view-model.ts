import { useMemo, useState } from "react"
import { router, useIsFocused } from "expo-router"
import { useUserStore } from "@/shared/store/user/user-store"
import { useCategoriesQuery } from "@/shared/queries/tourism/categories.query"
import { usePlacesQuery } from "@/shared/queries/tourism/places.query"
import { RADIUS_KM, useNearbyPlacesQuery } from "@/shared/queries/tourism/nearby-places.query"
import { getLocationIssue, useUserLocation } from "@/shared/hooks/use-user-location"
import { getRequestErrorMessage, ViewState } from "@/shared/utils/request-error"

const HOME_PLACES_LIMIT = 10

export const useHomeViewModel = () => {
  const user = useUserStore((state) => state.user)
  const categoriesQuery = useCategoriesQuery()
  const [selectedId, setSelectedId] = useState<string>()

  const categories = categoriesQuery.data ?? []
  const selectedCategory = selectedId ?? categories[0]?.id
  const placesQuery = usePlacesQuery(selectedCategory)
  const firstPage = placesQuery.data?.pages[0]
  const places = firstPage?.items.slice(0, HOME_PLACES_LIMIT) ?? []

  const categoriesState: ViewState = categoriesQuery.isPending
    ? "loading"
    : categoriesQuery.isError
      ? "error"
      : categories.length === 0
        ? "empty"
        : "success"

  const placesState: ViewState =
    categoriesState !== "success"
      ? "idle"
      : placesQuery.isPending
        ? "loading"
        : placesQuery.isError
          ? "error"
          : places.length === 0
            ? "empty"
            : "success"

  const location = useUserLocation()
  // A prévia do mapa é uma WebView: só fica montada com a Home visível, para poupar memória.
  const isFocused = useIsFocused()
  const nearbyQuery = useNearbyPlacesQuery(location.coords)
  const nearbyPlaces = nearbyQuery.data ?? []
  const nearbyMapPlaces = useMemo(
    () =>
      (nearbyQuery.data ?? []).flatMap(({ place }) =>
        place.coordenadas
          ? [{ id: place.id, latitude: place.coordenadas.latitude, longitude: place.coordenadas.longitude }]
          : []
      ),
    [nearbyQuery.data]
  )

  const getNearbyStatus = (): {
    state: ViewState
    message: string
    actionLabel?: string
    onAction?: () => void
  } => {
    const locationIssue = getLocationIssue(location)
    if (locationIssue) return locationIssue
    if (location.status === "locating" || nearbyQuery.isPending) return { state: "loading", message: "" }
    if (nearbyQuery.isError) {
      return {
        state: "error",
        message: getRequestErrorMessage(nearbyQuery.error, "os lugares próximos"),
        onAction: () => nearbyQuery.refetch(),
      }
    }
    if (nearbyPlaces.length === 0) {
      return { state: "empty", message: `Nenhum ponto turístico em até ${RADIUS_KM} km de você.` }
    }
    return { state: "success", message: "" }
  }

  const firstName = user?.name?.trim().split(" ")[0] || "viajante"

  return {
    firstName,
    initial: firstName.charAt(0).toUpperCase(),
    categories,
    categoriesState,
    categoriesError: getRequestErrorMessage(categoriesQuery.error, "as categorias"),
    onRetryCategories: categoriesQuery.refetch,
    selectedCategory,
    onPressPlace: (id: string) => router.push({ pathname: "/place/[id]", params: { id } }),
    onSelectCategory: setSelectedId,
    onOpenMap: () => router.push("/map"),
    nearbyPlaces,
    nearbyMapPlaces,
    isFocused,
    userLocation: location.coords,
    nearby: getNearbyStatus(),
    places,
    placesTotal: firstPage?.total ?? 0,
    placesState,
    placesError: getRequestErrorMessage(placesQuery.error, "os lugares"),
    onRetryPlaces: placesQuery.refetch,
    onSeeAll: () =>
      router.navigate({ pathname: "/(private)/places", params: { category: selectedCategory } }),
  }
}

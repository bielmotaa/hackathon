import { useMemo } from "react"
import { Alert, Linking } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { isAxiosError } from "axios"
import { usePlaceQuery } from "@/shared/queries/tourism/place.query"
import { informedValue } from "@/shared/utils/formatters"
import { getRequestErrorMessage, ViewState } from "@/shared/utils/request-error"

export type PlaceInfoKey = "address" | "hours" | "price" | "phone" | "site"

export const usePlaceDetailViewModel = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const placeQuery = usePlaceQuery(id)
  const place = placeQuery.data
  const isNotFound = isAxiosError(placeQuery.error) && placeQuery.error.response?.status === 404

  const state: ViewState = placeQuery.isPending
    ? "loading"
    : isNotFound
      ? "empty"
      : placeQuery.isError
        ? "error"
        : "success"

  const address = [place?.localizacao?.endereco, place?.localizacao?.bairro, place?.localizacao?.municipio]
    .map(informedValue)
    .filter(Boolean)
    .join(", ")
  const coordinates = place?.coordenadas
  // Coordenadas exatamente como a API devolve; sem coordenadas, não há marcador.
  const mapPlaces = useMemo(
    () => (place && coordinates ? [{ id: place.id, latitude: coordinates.latitude, longitude: coordinates.longitude }] : []),
    [place, coordinates]
  )
  const phone = informedValue(place?.contato?.telefone)
  const site = informedValue(place?.contato?.site)

  const info: { key: PlaceInfoKey; label: string; value: string; onPress?: () => void }[] = [
    { key: "address", label: "Endereço", value: address },
    { key: "hours", label: "Horário", value: informedValue(place?.horario_funcionamento) ?? "" },
    { key: "price", label: "Ingresso", value: informedValue(place?.preco_ingresso) ?? "" },
    {
      key: "phone",
      label: "Telefone",
      value: phone ?? "",
      onPress: () => Linking.openURL(`tel:${phone}`),
    },
    { key: "site", label: "Site", value: site ?? "", onPress: () => Linking.openURL(site!) },
  ]

  return {
    state,
    errorMessage: isNotFound ? "Lugar não encontrado." : getRequestErrorMessage(placeQuery.error, "o lugar"),
    onRetry: placeQuery.refetch,
    onBack: () => router.back(),
    mapPlaces,
    hasMap: Boolean(coordinates && place?.categoria_slug),
    // Abre o mapa do app já focado neste lugar (a categoria carrega os marcadores).
    onViewOnMap: () =>
      router.push({ pathname: "/map", params: { category: place?.categoria_slug ?? "", placeId: place?.id ?? "" } }),
    onOpenExternalMap: () => {
      if (!coordinates) return
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`
      ).catch(() => Alert.alert("Mapa", "Não foi possível abrir o Google Maps."))
    },
    place: place && {
      name: place.nome,
      category: place.categoria,
      categorySlug: place.categoria_slug ?? undefined,
      imageUrl: place.imagem?.url ?? undefined,
      imageCredit: place.imagem?.url ? (place.imagem.atribuicao ?? undefined) : undefined,
      subcategory: informedValue(place.subcategoria),
      description: informedValue(place.descricao_curta),
      tips: informedValue(place.dicas_observacoes),
    },
    info: info.filter((item) => item.value.length > 0),
  }
}

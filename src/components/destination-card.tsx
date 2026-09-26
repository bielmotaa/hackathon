import { useState } from "react"
import { Image, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import clsx from "clsx"
import { MapPin } from "lucide-react-native"
import { PlaceHttpResponse } from "@/shared/interfaces/http/tourism-interface"
import { formatDistance, informedValue } from "@/shared/utils/formatters"
import { getImageUrl } from "@/shared/utils/image"
import { CATEGORY_ICONS } from "@/components/category-tiles"

interface PlaceImageProps {
  categorySlug?: string
  imageUrl?: string
  className?: string
  iconSize?: number
}

interface DestinationCardProps {
  place: PlaceHttpResponse
  distanceKm?: number
  className?: string
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

const PLACEHOLDER_COLORS = ["#3D5A52", "#3B4A5C", "#2F4A34", "#5A4238", "#35525C", "#5A4A35"]

// Cor estável por categoria, só para o placeholder enquanto não há imagem.
const placeholderColor = (slug = "") =>
  PLACEHOLDER_COLORS[[...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0) % PLACEHOLDER_COLORS.length]

// Sem imagem (ou se ela falhar ao carregar), mostra o placeholder da categoria.
export function PlaceImage({ categorySlug, imageUrl, className, iconSize = 28 }: PlaceImageProps) {
  const [failedUrl, setFailedUrl] = useState<string>()

  if (imageUrl && failedUrl !== imageUrl) {
    return (
      <Image
        source={{ uri: getImageUrl(imageUrl) }}
        resizeMode="cover"
        onError={(event) => {
          console.warn("[PlaceImage] falha ao carregar", imageUrl, event.nativeEvent.error)
          setFailedUrl(imageUrl)
        }}
        className={className}
      />
    )
  }

  const Icon = CATEGORY_ICONS[categorySlug ?? ""] ?? MapPin

  return (
    <View
      className={clsx("items-center justify-center", className)}
      style={{ backgroundColor: placeholderColor(categorySlug) }}
    >
      <Icon size={iconSize} color="#F4EDE0" />
    </View>
  )
}

export function DestinationCard({ place, distanceKm, className, style, onPress }: DestinationCardProps) {
  const details = [
    distanceKm === undefined ? undefined : formatDistance(distanceKm),
    informedValue(place.subcategoria),
    informedValue(place.localizacao?.bairro),
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={style}
      className={clsx("overflow-hidden rounded-3xl", className)}
    >
      <PlaceImage
        categorySlug={place.categoria_slug ?? undefined}
        imageUrl={place.imagem?.url ?? undefined}
        className="aspect-[4/5] w-full"
      />
      <View className="absolute inset-x-0 bottom-0 bg-black/40 px-4 py-3">
        <Text className="font-sans-semibold text-base text-tourism-sand" numberOfLines={2}>
          {place.nome}
        </Text>
        {details ? (
          <Text className="mt-0.5 font-sans text-xs text-tourism-sand/80" numberOfLines={1}>
            {details}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

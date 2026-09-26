import { Text, TouchableOpacity, View } from "react-native"
import { ArrowRight } from "lucide-react-native"
import { PlaceImage } from "@/components/destination-card"

interface PlaceMapCardProps {
  name: string
  category: string
  categorySlug?: string
  imageUrl?: string
  distance?: string
  description?: string
  highlight?: string
  onPress: () => void
}

// Cartão compacto do lugar selecionado no mapa: imagem em faixa, identificação e uma informação de apoio.
export function PlaceMapCard({
  name,
  category,
  categorySlug,
  imageUrl,
  distance,
  description,
  highlight,
  onPress,
}: PlaceMapCardProps) {
  return (
    <View className="overflow-hidden rounded-3xl bg-tourism-forest">
      <View>
        <PlaceImage categorySlug={categorySlug} imageUrl={imageUrl} iconSize={24} className="h-24 w-full" />
        {distance ? (
          <View className="absolute right-3 top-3 rounded-full bg-tourism-night/85 px-3 py-1">
            <Text className="font-sans-medium text-xs text-tourism-sand">{distance}</Text>
          </View>
        ) : null}
      </View>

      <View className="gap-1 px-4 pb-4 pt-3">
        <Text className="font-sans-semibold text-base text-tourism-sand" numberOfLines={1}>
          {name}
        </Text>
        <Text className="font-sans-medium text-xs text-tourism-ember" numberOfLines={1}>
          {category}
        </Text>
        {description ? (
          <Text className="font-sans text-sm text-tourism-sand/85" numberOfLines={2}>
            {description}
          </Text>
        ) : null}
        {highlight ? (
          <Text className="font-sans text-xs text-tourism-mist" numberOfLines={1}>
            {highlight}
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Visualizar mais sobre ${name}`}
          className="mt-2 h-10 flex-row items-center justify-center gap-2 self-end rounded-full bg-tourism-ember px-5"
        >
          <Text className="font-sans-semibold text-sm text-tourism-sand">Visualizar mais</Text>
          <ArrowRight size={16} color="#F4EDE0" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

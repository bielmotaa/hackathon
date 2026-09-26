import { ReactElement } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import clsx from "clsx"
import {
  Castle,
  Church,
  Compass,
  Landmark,
  MapPin,
  ShoppingBag,
  TreePine,
  UtensilsCrossed,
  Waves,
} from "lucide-react-native"

interface CategoryTilesProps {
  categories: { id: string; label: string }[]
  selected: string
  onSelect: (id: string) => void
  className?: string
}

const ICON_SIZE = 26

// Slugs do catálogo (GET /categorias). Slug desconhecido usa o ícone padrão.
export const CATEGORY_ICONS: Record<string, typeof MapPin> = {
  pontos_turisticos_classicos_e_patrimonio: Castle,
  museus_e_centros_culturais: Landmark,
  ecoturismo_e_natureza: TreePine,
  praias_fluviais: Waves,
  pontos_religiosos: Church,
  gastronomia_tipica_e_mercados: UtensilsCrossed,
  comercio_e_centros_comerciais: ShoppingBag,
  arredores_de_manaus: Compass,
}

const iconFor = (id: string, color: string): ReactElement => {
  const Icon = CATEGORY_ICONS[id] ?? MapPin
  return <Icon size={ICON_SIZE} color={color} />
}

// Os nomes vêm da API e podem ser longos: cada item tem largura fixa e o nome usa até 2 linhas.
export function CategoryTiles({
  categories,
  selected,
  onSelect,
  className,
}: CategoryTilesProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {categories.map((category) => {
        const isSelected = category.id === selected
        return (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.8}
            onPress={() => onSelect(category.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className="w-24 items-center gap-2 px-1 py-1"
          >
            <View
              className={clsx(
                "h-14 w-14 items-center justify-center rounded-full",
                isSelected ? "bg-tourism-sand" : "bg-tourism-forest"
              )}
            >
              {iconFor(category.id, isSelected ? "#0F1613" : "#F4EDE0")}
            </View>
            <Text
              numberOfLines={2}
              className={clsx(
                "text-center font-sans-medium text-xs",
                isSelected ? "text-tourism-sand" : "text-tourism-mist"
              )}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

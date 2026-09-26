import { FC, ReactElement } from "react"
import { ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { ArrowLeft, Clock, Globe, Map as MapIcon, MapPin, Navigation, Phone, Ticket } from "lucide-react-native"
import { PlaceImage } from "@/components/destination-card"
import { StatusMessage } from "@/components/status-message"
import { TourismMap } from "@/components/tourism-map"
import { TourismButton } from "@/components/tourism-button"
import { PlaceInfoKey, usePlaceDetailViewModel } from "./place-detail-view-model"

const INFO_ICON_COLOR = "#A9B5AE"

const INFO_ICONS: Record<PlaceInfoKey, ReactElement> = {
  address: <MapPin size={18} color={INFO_ICON_COLOR} />,
  hours: <Clock size={18} color={INFO_ICON_COLOR} />,
  price: <Ticket size={18} color={INFO_ICON_COLOR} />,
  phone: <Phone size={18} color={INFO_ICON_COLOR} />,
  site: <Globe size={18} color={INFO_ICON_COLOR} />,
}

export const PlaceDetailViewUi: FC<ReturnType<typeof usePlaceDetailViewModel>> = ({
  state,
  errorMessage,
  onRetry,
  onBack,
  mapPlaces,
  hasMap,
  onViewOnMap,
  onOpenExternalMap,
  place,
  info,
}) => {
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const heroHeight = Math.min(Math.max(height * 0.36, 240), 380)

  return (
    <View className="flex-1 bg-tourism-night">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + (hasMap ? 104 : 32) }}>
        <View style={{ height: heroHeight }}>
          <PlaceImage
            categorySlug={place?.categorySlug}
            imageUrl={place?.imageUrl}
            iconSize={40}
            className="h-full w-full"
          />
          {place?.imageCredit ? (
            <Text
              numberOfLines={2}
              className="absolute bottom-12 left-6 max-w-[85%] rounded-lg bg-black/50 px-2 py-1 font-sans text-[11px] text-tourism-sand"
            >
              Foto: {place.imageCredit}
            </Text>
          ) : null}
        </View>

        <View className="-mt-8 rounded-t-[32px] bg-tourism-night px-6 pt-8">
          {state === "success" && place ? (
            <>
              <Text className="font-sans-semibold text-xs uppercase tracking-[2px] text-tourism-ember">
                {place.subcategory ?? place.category}
              </Text>
              <Text className="mt-2 font-sans-bold text-3xl tracking-tight text-tourism-sand">
                {place.name}
              </Text>
              {place.subcategory ? (
                <Text className="mt-1 font-sans text-sm text-tourism-mist">{place.category}</Text>
              ) : null}
              {place.description ? (
                <Text className="mt-4 font-sans text-base text-tourism-sand/85">{place.description}</Text>
              ) : null}

              {info.length > 0 ? (
                <View className="mt-6 rounded-3xl bg-tourism-forest px-4">
                  {info.map((item, index) => (
                    <TouchableOpacity
                      key={item.key}
                      disabled={!item.onPress}
                      onPress={item.onPress}
                      activeOpacity={0.7}
                      className={
                        index > 0
                          ? "flex-row items-center gap-3 border-t border-white/10 py-3.5"
                          : "flex-row items-center gap-3 py-3.5"
                      }
                    >
                      {INFO_ICONS[item.key]}
                      <View className="flex-1">
                        <Text className="font-sans text-xs text-tourism-mist">{item.label}</Text>
                        <Text
                          className={
                            item.onPress
                              ? "mt-0.5 font-sans-medium text-sm text-tourism-ember"
                              : "mt-0.5 font-sans-medium text-sm text-tourism-sand"
                          }
                        >
                          {item.value}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              <View className="mt-6 gap-3">
                <Text className="font-sans-semibold text-xs uppercase tracking-[2px] text-tourism-ember">
                  Localização
                </Text>
                {mapPlaces.length > 0 ? (
                  <TouchableOpacity
                    onPress={hasMap ? onViewOnMap : undefined}
                    disabled={!hasMap}
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityLabel="Abrir o mapa deste lugar"
                    className="h-56 overflow-hidden rounded-3xl"
                  >
                    <View className="flex-1" pointerEvents="none">
                      <TourismMap className="flex-1" places={mapPlaces} interactive={false} />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text className="font-sans text-sm text-tourism-mist">
                    A localização deste lugar não foi informada.
                  </Text>
                )}
              </View>

              {place.tips ? (
                <View className="mt-6 gap-2">
                  <Text className="font-sans-semibold text-xs uppercase tracking-[2px] text-tourism-ember">
                    Dicas
                  </Text>
                  <Text className="font-sans text-base text-tourism-sand/85">{place.tips}</Text>
                </View>
              ) : null}
            </>
          ) : state === "loading" ? (
            <StatusMessage state="loading" message="" />
          ) : (
            <StatusMessage
              state={state === "empty" ? "empty" : "error"}
              message={errorMessage}
              onRetry={onRetry}
            />
          )}
        </View>
      </ScrollView>

      {state === "success" && hasMap ? (
        <View
          className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-tourism-night px-6 pt-3"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="flex-row items-center gap-3">
            <TourismButton
              variant="ember"
              label="Ver no mapa"
              onPress={onViewOnMap}
              icon={<MapIcon size={18} color="#F4EDE0" />}
              className="flex-1"
            />
            <TouchableOpacity
              onPress={onOpenExternalMap}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir no Google Maps"
              className="h-14 w-14 items-center justify-center rounded-full bg-tourism-forest"
            >
              <Navigation size={20} color="#F4EDE0" />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        className="absolute left-6 h-11 w-11 items-center justify-center rounded-full bg-black/40"
        style={{ top: insets.top + 12 }}
      >
        <ArrowLeft size={20} color="#F4EDE0" />
      </TouchableOpacity>
    </View>
  )
}

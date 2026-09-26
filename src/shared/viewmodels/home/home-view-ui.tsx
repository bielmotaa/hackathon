import { FC } from "react"
import { ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Search } from "lucide-react-native"
import { CategoryTiles } from "@/components/category-tiles"
import { TourismMap } from "@/components/tourism-map"
import { DestinationCard } from "@/components/destination-card"
import { StatusMessage } from "@/components/status-message"
import { useHomeViewModel } from "./home-view-model"

export const HomeViewUi: FC<ReturnType<typeof useHomeViewModel>> = ({
  firstName,
  initial,
  categories,
  categoriesState,
  categoriesError,
  onRetryCategories,
  selectedCategory,
  onSelectCategory,
  onPressPlace,
  onOpenMap,
  nearbyPlaces,
  nearbyMapPlaces,
  isFocused,
  userLocation,
  nearby,
  places,
  placesTotal,
  placesState,
  placesError,
  onRetryPlaces,
  onSeeAll,
}) => {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const cardWidth = Math.min(Math.max(width * 0.54, 176), 260)

  return (
    <View className="flex-1 bg-tourism-night">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View
          className="flex-row items-center gap-4 px-6"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="h-12 w-12 items-center justify-center rounded-full bg-tourism-ember">
            <Text className="font-sans-bold text-xl text-tourism-sand">{initial}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-sans text-sm text-tourism-mist">Olá, {firstName}</Text>
            <Text className="mt-0.5 font-sans-bold text-2xl tracking-tight text-tourism-sand">
              Para onde quer ir hoje?
            </Text>
          </View>
        </View>

        <View className="mx-6 mt-7 h-12 flex-row items-center gap-3 rounded-full bg-tourism-forest px-4">
          <Search size={18} color="#A9B5AE" />
          <TextInput
            className="flex-1 font-sans text-base text-tourism-sand"
            placeholder="Busque destinos, experiências..."
            placeholderTextColor="#A9B5AE"
          />
        </View>

        <View className="mt-6">
          {categoriesState === "success" ? (
            <CategoryTiles
              categories={categories}
              selected={selectedCategory ?? ""}
              onSelect={onSelectCategory}
            />
          ) : (
            <StatusMessage
              state={categoriesState}
              message={
                categoriesState === "empty"
                  ? "Nenhuma categoria disponível no momento."
                  : categoriesError
              }
              onRetry={onRetryCategories}
            />
          )}
        </View>

        {placesState !== "idle" ? (
          <>
            <View className="mt-10 flex-row items-end justify-between px-6">
              <View>
                <Text className="font-sans-bold text-xl tracking-tight text-tourism-sand">
                  Lugares para visitar
                </Text>
                {placesState === "success" ? (
                  <Text className="mt-0.5 font-sans text-sm text-tourism-mist">
                    {placesTotal} {placesTotal === 1 ? "lugar" : "lugares"}
                  </Text>
                ) : null}
              </View>
              {placesState === "success" ? (
                <TouchableOpacity onPress={onSeeAll}>
                  <Text className="font-sans-medium text-sm text-tourism-ember">Ver todos</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {placesState === "success" ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-4"
                contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
              >
                {places.map((place) => (
                  <DestinationCard
                    key={place.id}
                    place={place}
                    style={{ width: cardWidth }}
                    onPress={() => onPressPlace(place.id)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="mt-4">
                <StatusMessage
                  state={placesState}
                  message={
                    placesState === "empty" ? "Nenhum lugar nesta categoria por enquanto." : placesError
                  }
                  onRetry={onRetryPlaces}
                />
              </View>
            )}
          </>
        ) : null}

        <View className="mt-10 flex-row items-end justify-between px-6">
          <View className="flex-1">
            <Text className="font-sans-bold text-xl tracking-tight text-tourism-sand">Lugares próximos</Text>
            <Text className="mt-0.5 font-sans text-sm text-tourism-mist">
              Atualiza conforme você se move.
            </Text>
          </View>
          <TouchableOpacity onPress={onOpenMap}>
            <Text className="font-sans-medium text-sm text-tourism-ember">Abrir mapa</Text>
          </TouchableOpacity>
        </View>

        {nearby.state === "success" ? (
          <>
            <TouchableOpacity
              onPress={onOpenMap}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Abrir mapa de lugares próximos"
              className="mx-6 mt-4 h-48 overflow-hidden rounded-3xl"
            >
              <View className="flex-1" pointerEvents="none">
                {isFocused ? (
                  <TourismMap
                    className="flex-1"
                    places={nearbyMapPlaces}
                    userLocation={userLocation}
                    interactive={false}
                  />
                ) : (
                  <View className="flex-1 bg-tourism-forest" />
                )}
              </View>
              <View className="absolute bottom-3 left-3 rounded-full bg-tourism-night/90 px-4 py-2">
                <Text className="font-sans-medium text-sm text-tourism-sand">
                  {nearbyPlaces.length} {nearbyPlaces.length === 1 ? "lugar próximo" : "lugares próximos"}
                </Text>
              </View>
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-4"
              contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
            >
              {nearbyPlaces.map(({ place, distanceKm }) => (
                <DestinationCard
                  key={place.id}
                  place={place}
                  distanceKm={distanceKm}
                  style={{ width: cardWidth }}
                  onPress={() => onPressPlace(place.id)}
                />
              ))}
            </ScrollView>
          </>
        ) : (
          <View className="mt-4">
            <StatusMessage
              state={nearby.state as "loading" | "error" | "empty"}
              message={nearby.message}
              onRetry={nearby.onAction}
              actionLabel={nearby.actionLabel}
            />
          </View>
        )}
      </ScrollView>
    </View>
  )
}

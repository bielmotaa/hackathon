import { FC } from "react"
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import clsx from "clsx"
import { ArrowLeft, LocateFixed } from "lucide-react-native"
import { PlaceMapCard } from "@/components/place-map-card"
import { TourismMap } from "@/components/tourism-map"
import { useMapViewModel } from "./map-view-model"

export const MapViewUi: FC<ReturnType<typeof useMapViewModel>> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPlace,
  focusId,
  onSelectPlace,
  onOpenDetails,
  mapPlaces,
  userLocation,
  locationIssue,
  nearestLabel,
  centerOnUserKey,
  onCenterOnUser,
  state,
  errorMessage,
  onRetry,
  onBack,
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-tourism-night">
      <StatusBar style="light" />
      <TourismMap
        className="flex-1"
        places={mapPlaces}
        userLocation={userLocation}
        selectedId={selectedPlace?.id}
        focusId={focusId}
        onSelectPlace={onSelectPlace}
        centerOnUserKey={centerOnUserKey}
      />

      <View className="absolute inset-x-0 top-0" style={{ paddingTop: insets.top + 12 }} pointerEvents="box-none">
        <View className="flex-row items-center gap-3 px-6" pointerEvents="box-none">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="h-11 w-11 items-center justify-center rounded-full bg-tourism-night/90"
          >
            <ArrowLeft size={20} color="#F4EDE0" />
          </TouchableOpacity>
          <View className="h-11 justify-center rounded-full bg-tourism-night/90 px-5">
            <Text className="font-sans-semibold text-sm text-tourism-sand">Mapa de lugares</Text>
          </View>
        </View>

        {categories.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
          >
            {categories.map((category) => {
              const isSelected = category.id === selectedCategory
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => onSelectCategory(category.id)}
                  activeOpacity={0.8}
                  accessibilityState={{ selected: isSelected }}
                  className={clsx(
                    "max-w-[240px] rounded-full px-4 py-2.5",
                    isSelected ? "bg-tourism-sand" : "bg-tourism-night/90"
                  )}
                >
                  <Text
                    numberOfLines={1}
                    className={clsx(
                      "font-sans-medium text-sm",
                      isSelected ? "text-tourism-night" : "text-tourism-sand"
                    )}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        ) : null}
      </View>

      <View
        className="absolute inset-x-0 gap-3 px-6"
        style={{ bottom: insets.bottom + 24 }}
        pointerEvents="box-none"
      >
        {userLocation ? (
          <View className="items-end" pointerEvents="box-none">
            <TouchableOpacity
              onPress={onCenterOnUser}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Centralizar na minha localização"
              className="h-12 w-12 items-center justify-center rounded-full bg-tourism-ember"
            >
              <LocateFixed size={22} color="#F4EDE0" />
            </TouchableOpacity>
          </View>
        ) : null}

        {locationIssue ? (
          <View className="flex-row items-center gap-3 rounded-2xl bg-tourism-night/95 px-4 py-3">
            <Text className="shrink font-sans text-sm text-tourism-sand">{locationIssue.message}</Text>
            <TouchableOpacity onPress={locationIssue.onAction} activeOpacity={0.8}>
              <Text className="font-sans-semibold text-sm text-tourism-ember">
                {locationIssue.actionLabel ?? "Tentar novamente"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {state !== "success" ? (
          <View className="flex-row items-center gap-3 rounded-2xl bg-tourism-night/95 px-4 py-3">
            {state === "loading" ? <ActivityIndicator color="#E2723A" /> : null}
            <Text className="shrink font-sans text-sm text-tourism-sand">
              {state === "loading"
                ? "Carregando lugares..."
                : state === "empty"
                  ? "Nenhum lugar com localização nesta categoria."
                  : errorMessage}
            </Text>
            {state === "error" ? (
              <TouchableOpacity onPress={onRetry} activeOpacity={0.8}>
                <Text className="font-sans-semibold text-sm text-tourism-ember">Tentar novamente</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : selectedPlace ? (
          <PlaceMapCard {...selectedPlace} onPress={() => onOpenDetails(selectedPlace.id)} />
        ) : (
          <View className="self-start rounded-full bg-tourism-night/95 px-4 py-2.5">
            <Text className="font-sans-medium text-sm text-tourism-sand">
              {mapPlaces.length} {mapPlaces.length === 1 ? "lugar" : "lugares"}
              {nearestLabel ? ` · ${nearestLabel}` : ""}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

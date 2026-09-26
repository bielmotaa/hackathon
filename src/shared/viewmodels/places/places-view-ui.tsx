import { FC } from "react"
import { ActivityIndicator, FlatList, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { CategoryTiles } from "@/components/category-tiles"
import { DestinationCard } from "@/components/destination-card"
import { StatusMessage } from "@/components/status-message"
import { usePlacesViewModel } from "./places-view-model"

export const PlacesViewUi: FC<ReturnType<typeof usePlacesViewModel>> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onPressPlace,
  places,
  state,
  errorMessage,
  onRetry,
  isFetchingMore,
  onEndReached,
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-tourism-night">
      <StatusBar style="light" />
      <FlatList
        data={state === "success" ? places : []}
        keyExtractor={(place) => place.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View className="mb-6">
            <View className="px-6" style={{ paddingTop: insets.top + 16 }}>
              <Text className="font-sans-semibold text-xs tracking-[2px] text-tourism-ember">
                DESTAQUES
              </Text>
              <Text className="mt-2 font-sans-bold text-3xl tracking-tight text-tourism-sand">
                Lugares em destaque
              </Text>
              <Text className="mt-3 font-sans text-base text-tourism-mist">
                Explore os pontos turísticos por categoria.
              </Text>
            </View>
            {categories.length > 0 ? (
              <CategoryTiles
                categories={categories}
                selected={selectedCategory ?? ""}
                onSelect={onSelectCategory}
                className="mt-6"
              />
            ) : null}
            {state !== "success" ? (
              <View className="mt-6">
                <StatusMessage
                  state={state}
                  message={state === "empty" ? "Nenhum lugar nesta categoria por enquanto." : errorMessage}
                  onRetry={onRetry}
                />
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <DestinationCard place={item} className="w-[48%]" onPress={() => onPressPlace(item.id)} />}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator color="#E2723A" /> : null}
      />
    </View>
  )
}

import "../styles/global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  })

  if (!fontsLoaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{headerShown: false}}>
         <Stack.Screen name="onboarding"/>
         <Stack.Screen name="sign-in"/>
         <Stack.Screen name="sign-up"/>
         <Stack.Screen name="(private)"/>
      </Stack>
    </QueryClientProvider>
  );
}

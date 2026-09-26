import "../styles/global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  if (!fontsLoaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{headerShown: false}}>
         <Stack.Screen name="onboarding"/>
         <Stack.Screen name="sign-in"/>
         {/* Cadastro temporariamente desabilitado (sign-up.tsx mantido) */}
         {/* <Stack.Screen name="sign-up"/> */}
         <Stack.Screen name="(private)"/>
         <Stack.Screen name="place/[id]"/>
         <Stack.Screen name="map"/>
      </Stack>
    </QueryClientProvider>
  );
}

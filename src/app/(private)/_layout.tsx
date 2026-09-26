import { Tabs } from "expo-router";
import { Compass, Home, User } from "lucide-react-native";

export default function PrivateLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E2723A",
        tabBarInactiveTintColor: "#A9B5AE",
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#0F1613",
          borderTopColor: "rgba(255,255,255,0.08)",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="places"
        options={{
          tabBarLabel: "Destaques",
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

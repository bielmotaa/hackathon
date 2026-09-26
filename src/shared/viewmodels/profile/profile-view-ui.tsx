import { FC, ReactElement } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { CalendarDays, LogOut, Mail, MapPin, Phone, UserRound } from "lucide-react-native"
import { CustomModal } from "@/components/custom-modal"
import { SessionReauthModal } from "@/components/session-reauth-modal"
import { SessionStatusBadge } from "@/components/session-status-badge"
import { ProfileFieldKey, useProfileViewModel } from "./profile-view-model"

const fieldIconColor = "#A9B5AE"

const FIELD_ICONS: Record<ProfileFieldKey, ReactElement> = {
  name: <UserRound size={18} color={fieldIconColor} />,
  birthDate: <CalendarDays size={18} color={fieldIconColor} />,
  city: <MapPin size={18} color={fieldIconColor} />,
  phone: <Phone size={18} color={fieldIconColor} />,
  email: <Mail size={18} color={fieldIconColor} />,
  memberSince: <CalendarDays size={18} color={fieldIconColor} />,
}

export const ProfileViewUi: FC<ReturnType<typeof useProfileViewModel>> = ({
  name,
  email,
  initials,
  stats,
  interests,
  sections,
  isSessionExpired,
  isReauthModalVisible,
  openReauthModal,
  closeReauthModal,
  reauthControl,
  reauthErrors,
  isReauthSubmitting,
  reauthError,
  handleReauthSubmit,
  isLogoutModalVisible,
  openLogoutModal,
  closeLogoutModal,
  confirmLogout,
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-tourism-night">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="items-center px-6" style={{ paddingTop: insets.top + 24 }}>
          <View className="h-24 w-24 items-center justify-center rounded-full bg-tourism-ember">
            <Text className="font-sans-bold text-3xl text-tourism-sand">{initials}</Text>
          </View>
          <Text className="mt-4 font-sans-bold text-2xl tracking-tight text-tourism-sand" numberOfLines={1}>
            {name}
          </Text>
          {email ? (
            <Text className="mt-1 font-sans text-sm text-tourism-mist" numberOfLines={1}>
              {email}
            </Text>
          ) : null}
          <View className="mt-3">
            <SessionStatusBadge
              isExpired={isSessionExpired}
              onPressExpired={openReauthModal}
              tone="on-brand"
            />
          </View>
        </View>

        <View className="mx-6 mt-6 flex-row rounded-3xl bg-tourism-forest py-4">
          {stats.map((stat, index) => (
            <View
              key={stat.label}
              className={index > 0 ? "flex-1 items-center border-l border-white/10" : "flex-1 items-center"}
            >
              <Text className="font-sans-bold text-2xl text-tourism-sand">{stat.value}</Text>
              <Text className="font-sans text-xs text-tourism-mist">{stat.label}</Text>
            </View>
          ))}
        </View>

        <View className="mt-8 gap-3 px-6">
          <Text className="font-sans-semibold text-xs uppercase tracking-[2px] text-tourism-ember">
            Você gosta de
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {interests.map((interest) => (
              <View key={interest} className="rounded-full bg-tourism-forest px-4 py-2">
                <Text className="font-sans-medium text-sm text-tourism-sand">{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-8 gap-6 px-6">
          {sections.map((section) => (
            <View key={section.title} className="gap-3">
              <Text className="font-sans-semibold text-xs uppercase tracking-[2px] text-tourism-ember">
                {section.title}
              </Text>

              <View className="rounded-3xl bg-tourism-forest px-4">
                {section.fields.map((field, index) => (
                  <View
                    key={field.key}
                    className={
                      index > 0
                        ? "flex-row items-center gap-3 border-t border-white/10 py-3.5"
                        : "flex-row items-center gap-3 py-3.5"
                    }
                  >
                    {FIELD_ICONS[field.key]}
                    <View className="flex-1">
                      <Text className="font-sans text-xs text-tourism-mist">{field.label}</Text>
                      <Text className="mt-0.5 font-sans-medium text-sm text-tourism-sand">
                        {field.value}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={openLogoutModal}
            activeOpacity={0.8}
            className="h-14 flex-row items-center justify-center gap-2 rounded-full border border-white/15"
          >
            <LogOut size={18} color="#E2723A" />
            <Text className="font-sans-bold text-base text-tourism-ember">Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SessionReauthModal
        modalVisible={isReauthModalVisible}
        control={reauthControl}
        errors={reauthErrors}
        isSubmitting={isReauthSubmitting}
        errorMessage={reauthError}
        onSubmit={handleReauthSubmit}
        onClose={closeReauthModal}
      />

      <CustomModal
        modalVisible={isLogoutModalVisible}
        icon={<LogOut size={28} color="#E2723A" />}
        title="Sair da conta?"
        description="Você precisará informar seu CPF e senha novamente para entrar."
        cancelLabel="Cancelar"
        labelSecundary="Sair"
        onPressCancel={closeLogoutModal}
        onPressOk={confirmLogout}
        onClose={closeLogoutModal}
      />
    </View>
  )
}

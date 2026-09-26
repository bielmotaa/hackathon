import { FC, ReactElement } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { StatusBar } from "expo-status-bar"
import {
  AtSign,
  Briefcase,
  Building2,
  CalendarDays,
  Fingerprint,
  IdCard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  UserRound,
  VenusAndMars,
} from "lucide-react-native"
import { CustomModal } from "@/components/custom-modal"
import { IconBadge } from "@/components/icon-badge"
import { SessionReauthModal } from "@/components/session-reauth-modal"
import { SessionStatusBadge } from "@/components/session-status-badge"
import { ProfileFieldKey, useProfileViewModel } from "./profile-view-model"

const fieldIconColor = "#6B7280"

const FIELD_ICONS: Record<ProfileFieldKey, ReactElement> = {
  name: <UserRound size={18} color={fieldIconColor} />,
  birthDate: <CalendarDays size={18} color={fieldIconColor} />,
  gender: <VenusAndMars size={18} color={fieldIconColor} />,
  cpf: <Fingerprint size={18} color={fieldIconColor} />,
  rg: <IdCard size={18} color={fieldIconColor} />,
  userName: <AtSign size={18} color={fieldIconColor} />,
  phone: <Phone size={18} color={fieldIconColor} />,
  email: <Mail size={18} color={fieldIconColor} />,
  city: <MapPin size={18} color={fieldIconColor} />,
  secretariat: <Building2 size={18} color={fieldIconColor} />,
  role: <Briefcase size={18} color={fieldIconColor} />,
  memberSince: <CalendarDays size={18} color={fieldIconColor} />,
}

export const ProfileViewUi: FC<ReturnType<typeof useProfileViewModel>> = ({
  name,
  email,
  initials,
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
  return (
    <View className="flex-1 bg-signup-background">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative overflow-hidden rounded-b-3xl bg-signup-primary px-6 pb-8 pt-14">
          <View pointerEvents="none" className="absolute -right-14 -top-16">
            <View className="h-56 w-56 rounded-full border border-white/10" />
            <View className="absolute left-14 top-14 h-32 w-32 rounded-full border-2 border-white/20" />
            <View className="absolute left-24 top-24 h-14 w-14 rounded-full bg-white/10" />
          </View>

          <Text className="text-[11px] font-semibold tracking-[2px] text-white/50">
            PERFIL
          </Text>

          <View className="mt-4 flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Text className="text-2xl font-extrabold text-white">
                {initials}
              </Text>
            </View>
            <View className="flex-1">
              <Text
                className="text-xl font-extrabold text-white"
                numberOfLines={1}
              >
                {name}
              </Text>
              {email ? (
                <Text
                  className="mt-0.5 text-sm text-white/75"
                  numberOfLines={1}
                >
                  {email}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-4">
            <SessionStatusBadge
              isExpired={isSessionExpired}
              onPressExpired={openReauthModal}
              tone="on-brand"
            />
          </View>
        </View>

        <View className="mt-6 gap-5 px-5 pb-8">
          {sections.map((section) => (
            <View key={section.title} className="gap-2">
              <Text className="text-xs font-semibold uppercase tracking-wide text-signup-gray">
                {section.title}
              </Text>

              <View className="gap-2">
                {section.fields.map((field) => (
                  <View
                    key={field.key}
                    className="flex-row items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm shadow-black/5"
                  >
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-signup-background">
                      {FIELD_ICONS[field.key]}
                    </View>
                    <View className="flex-1">
                      <Text className="text-[11px] font-semibold uppercase tracking-wide text-signup-gray">
                        {field.label}
                      </Text>
                      <Text className="mt-0.5 text-sm font-semibold text-signup-text">
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
            activeOpacity={0.85}
            className="flex-row items-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-black/5"
          >
            <IconBadge
              icon={<LogOut size={18} color="#B91C1C" />}
              tone="danger"
            />
            <Text className="text-base font-bold text-red-700">
              Sair da conta
            </Text>
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
        icon={<LogOut size={28} color="#265AB9" />}
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

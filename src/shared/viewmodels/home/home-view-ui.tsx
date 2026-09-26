import { FC } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { StatusBar } from "expo-status-bar"
import clsx from "clsx"
import { ChevronRight, CloudSun, HeartHandshake, LogOut, PackageCheck } from "lucide-react-native"
import { CustomModal } from "@/components/custom-modal"
import { DeviceStatusCard } from "@/components/device-status-card"
import { IconBadge } from "@/components/icon-badge"
import { ManualsCard } from "@/components/manuals-card"
import { SessionReauthModal } from "@/components/session-reauth-modal"
import { SessionStatusBadge } from "@/components/session-status-badge"
import { useHomeViewModel } from "./home-view-model"

export const HomeViewUi: FC<ReturnType<typeof useHomeViewModel>> = ({
  firstName,
  formattedDate,
  days,
  weather,
  deliveriesCount,
  onPressRealizarEntrega,
  onPressManuals,
  isConnected,
  isLocationGranted,
  onPressLocation,
  isLogoutModalVisible,
  openLogoutModal,
  closeLogoutModal,
  confirmLogout,
  isSessionExpired,
  isReauthModalVisible,
  openReauthModal,
  closeReauthModal,
  reauthControl,
  reauthErrors,
  isReauthSubmitting,
  reauthError,
  handleReauthSubmit,
}) => {
  return (
    <View className="flex-1 bg-signup-background">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative overflow-hidden rounded-b-3xl bg-signup-primary px-6 pb-6 pt-14">
          <View pointerEvents="none" className="absolute -right-14 -top-16">
            <View className="h-56 w-56 rounded-full border border-white/10" />
            <View className="absolute left-14 top-14 h-32 w-32 rounded-full border-2 border-white/20" />
            <View className="absolute left-24 top-24 h-14 w-14 rounded-full bg-white/10" />
          </View>

          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-sm text-white/70">{formattedDate}</Text>
              <Text className="mt-1 text-2xl font-extrabold text-white">
                Olá, {firstName}
              </Text>
              <Text className="mt-1 text-sm text-white/80">
                Vamos continuar a operação de hoje.
              </Text>
            </View>

            <TouchableOpacity
              onPress={openLogoutModal}
              activeOpacity={0.7}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/15"
              accessibilityRole="button"
              accessibilityLabel="Sair"
            >
              <LogOut size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View className="mt-4">
            <SessionStatusBadge
              isExpired={isSessionExpired}
              onPressExpired={openReauthModal}
              tone="on-brand"
            />
          </View>
        </View>


        <View className="mt-5 px-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {days.map((day) => (
              <View
                key={day.date.toISOString()}
                className={clsx(
                  "w-14 items-center rounded-full py-3.5",
                  day.isToday
                    ? "bg-signup-primary"
                    : "bg-white shadow-sm shadow-black/5"
                )}
              >
                <Text
                  className={clsx(
                    "text-[10px] font-semibold uppercase tracking-wide",
                    day.isToday ? "text-white/75" : "text-signup-gray"
                  )}
                >
                  {day.weekdayLabel}
                </Text>
                <Text
                  className={clsx(
                    "mt-1 text-lg font-bold",
                    day.isToday ? "text-white" : "text-signup-text"
                  )}
                >
                  {day.dayNumber}
                </Text>
                <View
                  className={clsx(
                    "mt-1.5 h-1 w-1 rounded-full",
                    day.isToday ? "bg-white" : "bg-transparent"
                  )}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-6 gap-3 px-5 pb-8">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-signup-gray">
            Painel do dia
          </Text>

          <TouchableOpacity
            onPress={onPressRealizarEntrega}
            activeOpacity={0.85}
            className="flex-row items-center justify-between rounded-2xl bg-signup-primary px-5 py-4"
          >
            <View className="flex-row items-center gap-3">
              <IconBadge tone="inverted" icon={<HeartHandshake size={20} color="#ffffff" />} />
              <View>
                <Text className="text-base font-bold text-white">
                  Realizar entrega
                </Text>
                <Text className="text-xs text-white/75">
                  Registrar uma nova entrega
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#ffffff" />
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
              <IconBadge icon={<PackageCheck size={18} color="#265AB9" />} />
              <Text className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-signup-gray">
                Entregas realizadas
              </Text>
              <Text className="mt-1 text-3xl font-extrabold text-signup-text">
                {deliveriesCount ?? "—"}
              </Text>
              <Text className="mt-1 text-[11px] text-signup-gray">
                {deliveriesCount === null
                  ? "Nenhum registro ainda"
                  : "Total no período"}
              </Text>
            </View>

            <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
              <IconBadge icon={<CloudSun size={18} color="#265AB9" />} />
              <Text className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-signup-gray">
                {weather.city}
              </Text>
              <Text className="mt-1 text-3xl font-extrabold text-signup-text">
                {weather.temperature}°
              </Text>
              <Text className="mt-1 text-[11px] text-signup-gray">
                {weather.condition} · Máx {weather.max}° Mín {weather.min}°
              </Text>
            </View>
          </View>
        </View>
        <View className="px-5">
          <Text className="mb-2 mt-[-10] text-xs font-semibold uppercase tracking-wide text-signup-gray">
            Permissões
          </Text>
          <DeviceStatusCard
            isLocationGranted={isLocationGranted}
            onPressLocation={onPressLocation}
            isConnected={isConnected}
          />
        </View>

        <View className="mx-5 mt-5 mb-8">
          <ManualsCard onPress={onPressManuals} />
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

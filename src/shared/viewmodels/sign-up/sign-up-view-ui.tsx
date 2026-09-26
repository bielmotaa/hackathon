import { FC } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Link, router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import Checkbox from "expo-checkbox"
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Fingerprint,
  Mail,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react-native"
import { Button } from "@/components/button"
import { CustomModal } from "@/components/custom-modal"
import { InputControl } from "@/components/input-control"
import { SelectPickerControl } from "@/components/select-picker-control"
import {
  formatDateInputInput,
  formatPhoneNumber,
  maskCpf,
} from "@/shared/utils/formatters"
import { GENDER_OPTIONS } from "./sign-up-schema"
import { useSignUpViewModel } from "./sign-up-view-model"

const iconColor = "#6B7280"
const iconSize = 18

export const SignUpViewUi: FC<ReturnType<typeof useSignUpViewModel>> = ({
  control,
  errors,
  isSubmitting,
  cities,
  isLoadingCities,
  secretariats,
  isLoadingSecretariats,
  checkPrivacy,
  setCheckPrivacy,
  handleSubmit,
  isSuccessModalVisible,
  isErrorModalVisible,
  closeSuccessModal,
  closeErrorModal,
}) => {
  return (
    <View className="flex-1 bg-signup-background">
      <StatusBar style="dark" />
      <View className="flex-1 px-5 py-5">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
         
            <View className="w-full h-12 pt-5">
              <TouchableOpacity
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back()
                  } else {
                    router.replace("/sign-in")
                  }
                }}
                activeOpacity={0.7}
              >
                <ChevronLeft size={24} color="#171717" />
              </TouchableOpacity>
            </View>

            <Text className="text-2xl font-extrabold text-gray-900">
              Faça seu Cadastro
            </Text>
            <Text className="text-sm text-gray-700 mb-4">
              e comece a usar o app.
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-base font-extrabold text-gray-700 mt-1 mb-2">
              Dados Pessoais
            </Text>
            <InputControl
              isRequire
              name="name"
              label="Nome "
              placeholder="Digite seu nome"
              control={control}
              error={errors.name?.message}
              icon={<UserRound size={iconSize} color={iconColor} />}
            />

            <SelectPickerControl
              name="gender"
              items={GENDER_OPTIONS}
              control={control}
              label="Sexo "
            />

            <InputControl
              isRequire
              name="ssn"
              label="CPF "
              mask={maskCpf}
              maxLength={14}
              keyboardType="numeric"
              placeholder="Digite seu CPF"
              control={control}
              error={errors.ssn?.message}
              icon={<Fingerprint size={iconSize} color={iconColor} />}
            />

            <InputControl
              isRequire
              label="Data de Nascimento "
              name="birthDate"
              placeholder="Informe sua data de nascimento"
              error={errors.birthDate?.message}
              control={control}
              keyboardType="numeric"
              maxLength={10}
              mask={formatDateInputInput}
              icon={<CalendarDays size={iconSize} color={iconColor} />}
            />

            <SelectPickerControl
              isRequire
              name="secretariatId"
              items={secretariats}
              loading={isLoadingSecretariats}
              control={control}
              label="Secretaria "
              error={errors.secretariatId?.message}
            />

            <Text className="text-base font-extrabold text-gray-700 mt-1 mb-2">
              Contato
            </Text>

            <InputControl
              isRequire
              name="email"
              label="E-mail "
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Informe seu e-mail"
              control={control}
              error={errors.email?.message}
              icon={<Mail size={iconSize} color={iconColor} />}
            />

            <InputControl
              label="Telefone"
              control={control}
              mask={formatPhoneNumber}
              name="phone"
              error={errors.phone?.message}
              placeholder="Digite seu telefone"
              keyboardType="numeric"
              maxLength={15}
              icon={<Phone size={iconSize} color={iconColor} />}
            />

            <Text className="text-base font-extrabold text-gray-700 mt-1 mb-2">
              Endereço
            </Text>
            <SelectPickerControl
              isRequire
              name="cityId"
              items={cities}
              loading={isLoadingCities}
              control={control}
              label="Cidade "
              error={errors.cityId?.message}
            />

            <InputControl
              isRequire
              label="Endereço"
              control={control}
              name="street"
              error={errors.street?.message}
              placeholder="Informe seu endereço"
              icon={<MapPin size={iconSize} color={iconColor} />}
            />

            <Text className="text-base font-extrabold text-gray-700 mt-1 mb-2">
              Senha
            </Text>
            <InputControl
              isRequire
              label=" Senha "
              control={control}
              name="password"
              error={errors.password?.message}
              placeholder="Informe uma senha"
              secury
            />
            <InputControl
              isRequire
              label=" Confirme sua senha "
              control={control}
              name="confirmPassword"
              error={errors.confirmPassword?.message}
              placeholder="Informe a mesma senha"
              secury
            />

            <View className="flex-row mt-3 mb-4 items-start">
              <Checkbox
                className="mr-2 bg-white"
                value={checkPrivacy}
                onValueChange={setCheckPrivacy}
              />
              <Text className="text-xs text-[#292929] flex-1">
                Li e aceito a Política de Privacidade e o Termo de Uso.
              </Text>
            </View>

            <View className="mt-auto p-2 border-t">
              <Button
                label={isSubmitting ? "Carregando..." : "Cadastrar"}
                onPress={handleSubmit}
                isLoading={isSubmitting}
              />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <CustomModal
        modalVisible={isSuccessModalVisible}
        titleButton="Ok"
        onPressOk={closeSuccessModal}
        title="Cadastro realizado com sucesso!"
        description="Agora você já pode entrar com seu CPF e senha."
        icon={<CheckCircle2 size={24} color="#22c55e" />}
      />

      <CustomModal
        modalVisible={isErrorModalVisible}
        titleButton="Tentar novamente"
        onPressOk={closeErrorModal}
        title="Erro ao concluir cadastro"
        description="Não foi possível concluir o cadastro. Verifique seus dados e tente novamente."
        icon={<XCircle size={24} color="#ef4444" />}
      />
    </View>
  )
}

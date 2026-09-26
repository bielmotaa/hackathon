import { ReactNode, useState } from "react"
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native"
import { Lock, LockOpen } from "lucide-react-native"
import clsx from "clsx"

export interface InputProps extends TextInputProps {
  error?: string
  label?: string
  secury?: boolean
  isRequire?: boolean
  icon?: ReactNode
  tone?: "light" | "dark"
}

export function Input({
  label,
  error,
  isRequire,
  secury = false,
  icon,
  tone = "light",
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const isDark = tone === "dark"
  const mutedColor = isDark ? "#A9B5AE" : "#6B7280"

  const toggleSecure = () => setIsPasswordVisible((prev) => !prev)

  return (
    <View
      className={clsx(
        "w-full p-2 mb-4 justify-center",
        isDark
          ? "h-[72px] rounded-2xl border bg-tourism-forest"
          : "h-16 rounded-lg border-b bg-slate-400/25",
        error
          ? "border-signup-error"
          : isDark
            ? "border-white/10"
            : "border-signup-border"
      )}
    >
      {label && (
        <Text
          className={clsx(
            "mt-2 pl-2 font-sans-medium text-xs",
            isDark ? "text-tourism-mist" : "text-signup-text"
          )}
        >
          {label}
          {isRequire && <Text className="font-sans text-xs text-signup-error"> *</Text>}
        </Text>
      )}
      <View className="flex-row items-center">
        <TextInput
          allowFontScaling={false}
          className={clsx(
            "flex-1 pl-2 pb-1",
            isDark ? "font-sans text-base text-tourism-sand" : "font-sans text-sm text-signup-text"
          )}
          placeholderTextColor={mutedColor}
          secureTextEntry={secury && !isPasswordVisible}
          {...rest}
        />
        {secury ? (
          <TouchableOpacity onPress={toggleSecure} className="mr-3">
            {isPasswordVisible ? (
              <LockOpen size={18} color={mutedColor} />
            ) : (
              <Lock size={18} color={mutedColor} />
            )}
          </TouchableOpacity>
        ) : (
          icon && <View className="mr-3">{icon}</View>
        )}
      </View>
    </View>
  )
}

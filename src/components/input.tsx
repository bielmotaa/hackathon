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
}

export function Input({
  label,
  error,
  isRequire,
  secury = false,
  icon,
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const toggleSecure = () => setIsPasswordVisible((prev) => !prev)

  return (
    <View
      className={clsx(
        "w-full p-2 mb-4 rounded-lg h-16 justify-center border-b bg-slate-400/25",
        error ? "border-signup-error" : "border-signup-border"
      )}
    >
      {label && (
        <Text className="font-medium text-xs pl-2 mt-2 text-signup-text">
          {label}
          {isRequire && <Text className="text-xs text-signup-error"> *</Text>}
        </Text>
      )}
      <View className="flex-row items-center">
        <TextInput
          allowFontScaling={false}
          className="flex-1 text-sm pl-2 pb-1 text-signup-text"
          placeholderTextColor="#6B7280"
          secureTextEntry={secury && !isPasswordVisible}
          {...rest}
        />
        {secury ? (
          <TouchableOpacity onPress={toggleSecure} className="mr-3">
            {isPasswordVisible ? (
              <LockOpen size={18} color="#6B7280" />
            ) : (
              <Lock size={18} color="#6B7280" />
            )}
          </TouchableOpacity>
        ) : (
          icon && <View className="mr-3">{icon}</View>
        )}
      </View>
    </View>
  )
}

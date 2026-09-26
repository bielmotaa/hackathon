import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native"
import clsx from "clsx"

interface ButtonProps extends TouchableOpacityProps {
  label: string
  isLoading?: boolean
}

export function Button({ label, isLoading, disabled, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      className={clsx(
        "w-full items-center justify-center h-14 rounded-md mt-4 bg-signup-primary",
        (isLoading || disabled) && "opacity-60"
      )}
      activeOpacity={0.7}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="#e5e7eb" />
      ) : (
        <Text className="text-white font-extrabold">{label}</Text>
      )}
    </TouchableOpacity>
  )
}

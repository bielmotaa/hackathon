import { ReactNode } from "react"
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native"
import clsx from "clsx"

interface TourismButtonProps extends TouchableOpacityProps {
  label: string
  icon?: ReactNode
  isLoading?: boolean
  variant?: "light" | "ember"
}

export function TourismButton({
  label,
  icon,
  isLoading,
  disabled,
  variant = "light",
  className,
  ...rest
}: TourismButtonProps) {
  const isLight = variant === "light"

  return (
    <TouchableOpacity
      className={clsx(
        "h-14 w-full flex-row items-center justify-center gap-2 rounded-full",
        isLight ? "bg-tourism-sand" : "bg-tourism-ember",
        (isLoading || disabled) && "opacity-60",
        className
      )}
      activeOpacity={0.8}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={isLight ? "#0F1613" : "#F4EDE0"} />
      ) : (
        <>
          <Text
            className={clsx(
              "font-sans-semibold text-base",
              isLight ? "text-tourism-night" : "text-tourism-sand"
            )}
          >
            {label}
          </Text>
          {icon}
        </>
      )}
    </TouchableOpacity>
  )
}

import { Text, View } from "react-native"
import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Input, InputProps } from "./input"

interface InputControlProps<T extends FieldValues> extends Omit<InputProps, "value" | "onChangeText"> {
  control: Control<T>
  name: Path<T>
  mask?: (value: string) => string
}

export function InputControl<T extends FieldValues>({
  control,
  name,
  mask,
  error,
  ...rest
}: InputControlProps<T>) {
  return (
    <View>
      {error && <Text className="text-xs mb-1 text-signup-error">{error}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value ?? ""}
            onChangeText={(text) => onChange(mask ? mask(text) : text)}
            error={error}
            {...rest}
          />
        )}
      />
    </View>
  )
}

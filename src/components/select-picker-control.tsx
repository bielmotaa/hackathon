import { Text, View } from "react-native"
import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { SelectPicker, SelectPickerProps } from "./select-picker"

interface SelectPickerControlProps<T extends FieldValues>
  extends Omit<SelectPickerProps, "value" | "onValueChange"> {
  control: Control<T>
  name: Path<T>
}

export function SelectPickerControl<T extends FieldValues>({
  control,
  name,
  error,
  ...rest
}: SelectPickerControlProps<T>) {
  return (
    <View>
      {error && <Text className="text-xs mb-1 text-signup-error">{error}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <SelectPicker
            value={value === undefined || value === "" ? null : value}
            onValueChange={onChange}
            error={error}
            {...rest}
          />
        )}
      />
    </View>
  )
}

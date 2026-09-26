import { useMemo, useState } from "react"
import { Modal, Pressable, ScrollView, Text, View } from "react-native"
import { ChevronDown } from "lucide-react-native"
import clsx from "clsx"

type SelectItem = {
  label: string
  value: string | number | null
}

export interface SelectPickerProps {
  onValueChange: (value: string | number | null) => void
  items: SelectItem[]
  value?: string | number | null
  label?: string
  error?: string
  isRequire?: boolean
  placeholder?: string
  loading?: boolean
  disabled?: boolean
}

export function SelectPicker({
  onValueChange,
  items,
  label,
  value,
  error,
  isRequire,
  loading = false,
  disabled = false,
  placeholder,
}: SelectPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedItem = useMemo(
    () => items.find((item) => item.value === value),
    [items, value]
  )

  return (
    <View
      className={clsx(
        "w-full p-2 mb-4 rounded-lg h-16 justify-center border-b bg-slate-400/25",
        error ? "border-signup-error" : "border-signup-border",
        disabled && "opacity-50"
      )}
    >
      {label && (
        <Text className="font-medium text-xs pl-2 mt-2 text-signup-text">
          {label}
          {isRequire && <Text className="text-xs text-signup-error"> *</Text>}
        </Text>
      )}

      <Pressable
        onPress={() => !disabled && !loading && setIsOpen(true)}
        className="flex-row items-center justify-between pl-2 pr-3 pb-1"
      >
        <Text
          allowFontScaling={false}
          style={{
            color: selectedItem ? "#2A2A2A" : "#6B7280",
            fontSize: 13,
          }}
        >
          {loading
            ? "Carregando..."
            : selectedItem?.label || placeholder || "Selecione uma opção"}
        </Text>
        <ChevronDown size={18} color="#6B7280" />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            className="w-full max-w-md max-h-[70%] rounded-xl p-4 bg-[#e5e7eb]"
            onPress={() => null}
          >
            <Text className="text-lg font-bold text-signup-text">
              {label || "Selecione uma opção"}
            </Text>
            <Text className="mb-3 text-sm text-signup-text">
              Selecione uma das opções abaixo
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {items.map((item, index) => {
                const isSelected = item.value === value
                return (
                  <Pressable
                    key={`${String(item.value)}-${index}`}
                    className={clsx(
                      "mb-2 rounded-md px-2 py-3 border border-gray-300",
                      isSelected && "bg-gray-300"
                    )}
                    onPress={() => {
                      onValueChange(item.value)
                      setIsOpen(false)
                    }}
                  >
                    <Text className="text-sm text-signup-text">{item.label}</Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

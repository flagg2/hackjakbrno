import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

interface OptionSelectProps<T extends string> {
  options: SelectOption<T>[];
  defaultValue: T;
  onValueChange: (value: T) => void;
}

export const OptionSelect = <T extends string>({
  options,
  defaultValue,
  onValueChange,
}: OptionSelectProps<T>) => (
  <Select defaultValue={defaultValue} onValueChange={onValueChange}>
    <SelectTrigger className="w-[180px] mt-1">
      <SelectValue
        placeholder={options.find((opt) => opt.value === defaultValue)?.label}
      />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

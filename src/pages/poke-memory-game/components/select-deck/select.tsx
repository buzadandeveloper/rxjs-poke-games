interface SelectProps {
  label?: string;
  defaultValue: number;
  options: number[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({ label, defaultValue, options, onChange }: SelectProps) => {
  return (
    <div className="flex items-center gap-4">
      {label && <label className="text-sm">{label}</label>}
      <select
        className="select select-sm outline-none"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

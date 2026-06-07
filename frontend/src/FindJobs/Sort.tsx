import { IconAdjustments, IconCheck } from "@tabler/icons-react";
import { Combobox, useCombobox } from "@mantine/core";

const opt = [
  "Relevance",
  "Most Recent",
  "Salary (Low to High)",
  "Salary (High to Low)",
];

const Sort = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = opt.map((item) => (
    <Combobox.Option
      value={item}
      key={item}
      className="!text-mine-shaft-200 hover:!bg-mine-shaft-700 !py-2 !px-3"
    >
      <div className="flex items-center justify-between">
        <span>{item}</span>
        {value === item && (
          <IconCheck className="h-4 w-4 text-bright-sun-400" />
        )}
      </div>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      width={200}
      position="bottom-end"
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <div
          onClick={() => combobox.toggleDropdown()}
          className="cursor-pointer border border-bright-sun-400 flex gap-2 text-sm items-center px-3 py-1.5 rounded-xl hover:bg-mine-shaft-800 transition-all duration-200 select-none active:scale-95"
        >
          {value}
          <IconAdjustments className="text-bright-sun-400 h-5 w-5" />
        </div>
      </Combobox.Target>

      <Combobox.Dropdown className="!bg-mine-shaft-900 !border-mine-shaft-700 !rounded-lg !shadow-lg !shadow-black/40">
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default Sort;

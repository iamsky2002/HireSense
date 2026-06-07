import { useState, useEffect } from "react";
import {
  Checkbox,
  Combobox,
  Group,
  Pill,
  PillsInput,
  useCombobox,
} from "@mantine/core";

interface MultiInputProps {
  title: string;
  icon: any;
  options: string[];
}

const MultiInput = (props: MultiInputProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [data, setData] = useState<string[]>([]);
  const [value, setValue] = useState<string[]>([]);
  
  useEffect(() => {
    setData(props.options);
  }, [props.options]);

  const exactOptionMatch = data.some((item) => item === search);

  const handleValueSelect = (val: string) => {
    setSearch("");

    if (val === "$create") {
      setData((current) => [...current, search]);
      setValue((current) => [...current, search]);
    } else {
      setValue((current) =>
        current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val],
      );
    }
  };

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = (
    <>
      {value.slice(0, 2).map((item) => (
        <Pill
          key={item}
          size="md"
          withRemoveButton
          onRemove={() => handleValueRemove(item)}
          className="bg-mine-shaft-700 text-white text-sm font-medium px-1 rounded-lg"
        >
          {item}
        </Pill>
      ))}
      {value.length > 2 && (
        <Pill
          size="md"
          className="bg-bright-sun-400 text-mine-shaft-900 text-sm font-semibold px-1 rounded-lg"
        >
          +{value.length - 2} more
        </Pill>
      )}
    </>
  );

  const options = data
    .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          <Checkbox
            checked={value.includes(item)}
            onChange={() => {}}
            aria-hidden
            tabIndex={-1}
            color="green"
            style={{ pointerEvents: "none" }}
          />
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          variant="unstyled"
          rightSection={<Combobox.Chevron className="text-mine-shaft-300" />}
          onClick={() => combobox.openDropdown()}
          leftSection={
            <div className="flex items-center gap-2">
              <props.icon size={25} className="text-bright-sun-400" />
              <div className="border-l border-mine-shaft-600 h-6"></div>
            </div>
          }
          className="bg-mine-shaft-800 border border-mine-shaft-600 rounded-xl px-2 py-2 text-base focus-within:border-bright-sun-400 transition-all duration-300"
        >
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                variant="unstyled"
                onFocus={() => combobox.openDropdown()}
                value=""
                placeholder={value.length === 0 ? props.title : ""}
                readOnly
                onChange={() => {}}
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown className="border border-mine-shaft-600 border-t-0 rounded-b-xl bg-mine-shaft-900 shadow-lg shadow-mine-shaft-950">
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={`Search ${props.title}`}
          className="border-b border-mine-shaft-600"
        />
        <Combobox.Options style={{ maxHeight: 200, overflowY: "auto" }}>
          {options}

          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}

          {exactOptionMatch &&
            search.trim().length > 0 &&
            options.length === 0 && (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
        </Combobox.Options>
        <div className="border-t border-mine-shaft-600 mt-1" />
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default MultiInput;

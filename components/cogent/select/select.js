import { Select as AntSelect } from "antd";

export const Select = ({ style, value, onChange, options }) => {
  const selectOptions = options.map((option) => {
    const isObject = typeof option === "object";
    const selectLabel = isObject ? option.label : option;
    const selectValue = isObject ? option.value : option;

    return (
      <AntSelect.Option key={selectValue} value={selectValue}>
        {selectLabel}
      </AntSelect.Option>
    );
  });

  return (
    <AntSelect defaultValue={value} onChange={onChange} style={style}>
      {selectOptions}
    </AntSelect>
  );
};

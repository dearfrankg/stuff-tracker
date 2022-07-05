import { Breadcrumb } from "antd";

export const MyBreadcrumb = ({ style, options }) => {
  return (
    <Breadcrumb style={style}>
      {options.map((option, optionIndex) => (
        <Breadcrumb.Item key={optionIndex}>
          <a href="">{option}</a>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

import { useContext } from "react";
import { List, ListProps } from "antd";
import { LogContext } from "../APIProvider/APIProvider";

interface PropTypes extends ListProps<string> {}

/**
 * Displays a list of logs using monospace font.
 */
export default function LogList({ ...listProps }: PropTypes) {
  const logContext = useContext(LogContext);

  return (
    <List
      dataSource={logContext.data.log}
      renderItem={(item) => (
        <List.Item style={{ fontFamily: "Space Mono, monospace" }}>
          {item}
        </List.Item>
      )}
      {...listProps}
    />
  );
}

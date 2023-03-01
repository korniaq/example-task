import React, { createContext } from "react";
import { notification } from "antd";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";

import { FormDataType, LogDataType, ContextType } from "../../types";

const url = "http://localhost:8000/api/logs";
const defaultData = { name: "", email: "", log: [] };

export const LogContext = createContext<ContextType>({
  data: defaultData,
  isLoading: false,
  handleSubmit: (values: FormDataType): void => {},
});

type PropTypes = {
  children?: React.ReactNode;
};

/**
 * Creates context that handles the post request and shows notification
 * In the case of error, logs the error and shows notification
 * @param children - Children components
 */
export default function APIProvider({ children }: PropTypes) {
  const mutation = useMutation<LogDataType, AxiosError, FormDataType>(
    (values) =>
      axios
        .post(url, values)
        .then((response) => {
          notification.success({ message: "Submitted successfully" });
          return response.data;
        })
        .catch((err) => {
          if (err.response && typeof err.response.data === "string") {
            notification.error({ message: err.response.data });
          } else {
            notification.error({ message: err.message });
          }
          console.log(err);
        })
  );

  return (
    <LogContext.Provider
      value={{
        data: mutation.data || defaultData,
        isLoading: mutation.isLoading,
        handleSubmit: mutation.mutate,
      }}
    >
      {children}
    </LogContext.Provider>
  );
}

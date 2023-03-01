export type FormDataType = {
  name: string;
  email: string;
  log: string;
};

export type LogDataType = {
  name: string;
  email: string;
  log: string[];
};

export type ContextType = {
  data: LogDataType;
  isLoading: boolean;
  handleSubmit: (values: FormDataType) => void;
};

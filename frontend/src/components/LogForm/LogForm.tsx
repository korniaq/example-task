import { useContext } from "react";
import { Button, Form, FormProps, Input } from "antd";
import { LogContext } from "../APIProvider/APIProvider";
import { FormDataType } from "../../types";

const errorLogRegexp = /^(E)\s+(\d{1,2})\s+(\d+)\s+(.+)$/;
const otherLogRegexp = /^(W|I)\s+(\d+)\s+(.+)$/;
const logRegexp = new RegExp(
  errorLogRegexp.source + "|" + otherLogRegexp.source,
  "gm"
);

interface PropTypes extends FormProps {}

/**
 * Creates form component and handles submitting
 */
export default function LogForm({ ...formProps }: PropTypes) {
  const logContext = useContext(LogContext);
  const [form] = Form.useForm();

  /**
   * Submits the form and resets the fields
   * @param values
   */
  const onFinish = (values: FormDataType) => {
    logContext.handleSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      onFinish={onFinish}
      validateTrigger="onBlur"
      form={form}
      {...formProps}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please input correct email address!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Log"
        name="log"
        rules={[
          { required: true, message: "Please input your log!" },
          {
            pattern: logRegexp,
            message: "Please input a correct log!",
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={logContext.isLoading}
          disabled={logContext.isLoading}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

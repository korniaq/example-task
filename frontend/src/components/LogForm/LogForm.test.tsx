/* eslint-disable testing-library/no-node-access */
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { LogContext } from "../APIProvider/APIProvider";
import LogForm from "./LogForm";

const mockMutate = jest.fn();
const mockHandleSubmit = jest.fn();
const defaultContextValue = {
  data: { name: "", email: "", log: [] },
  isLoading: false,
  handleSubmit: mockHandleSubmit,
};

describe("LogForm", () => {
  beforeEach(() => {
    mockHandleSubmit.mockClear();
    mockMutate.mockClear();
  });

  it("renders the form properly", () => {
    render(
      <LogContext.Provider value={defaultContextValue}>
        <LogForm />
      </LogContext.Provider>
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Log")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("calls handleSubmit and resets the form fields when form is submitted", async () => {
    render(
      <LogContext.Provider
        value={{ ...defaultContextValue, handleSubmit: mockMutate }}
      >
        <LogForm />
      </LogContext.Provider>
    );

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const logInput = screen.getByLabelText("Log");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(nameInput, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(logInput, { target: { value: "E 01 123 Test Error" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockMutate).toHaveBeenCalledTimes(1));
    expect(mockMutate).toHaveBeenCalledWith({
      name: "Test",
      email: "test@test.com",
      log: "E 01 123 Test Error",
    });

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Log")).toHaveValue("");
  });

  it("shows loading indicator on submit button when isLoading is true", () => {
    render(
      <LogContext.Provider value={{ ...defaultContextValue, isLoading: true }}>
        <LogForm />
      </LogContext.Provider>
    );

    const submitButton = screen.getByText("Submit");
    expect(submitButton.parentElement).toBeDisabled();
    expect(submitButton.parentElement).toHaveClass("ant-btn-loading");
  });

  it("shows error message when form is submitted with invalid data", async () => {
    render(
      <LogContext.Provider
        value={{ ...defaultContextValue, handleSubmit: mockMutate }}
      >
        <LogForm />
      </LogContext.Provider>
    );

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const logInput = screen.getByLabelText("Log");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(emailInput, { target: { value: "invalid email" } });
    fireEvent.change(logInput, { target: { value: "invalid log" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockMutate).not.toHaveBeenCalled());

    await screen.findByText("Please input your name!");
    await screen.findByText("Please input correct email address!");
    await screen.findByText("Please input a correct log!");
  });
});

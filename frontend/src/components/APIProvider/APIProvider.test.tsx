import { render, fireEvent, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import APIProvider, { LogContext } from "./APIProvider";
import axios from "axios";

const queryClient = new QueryClient();
jest.mock("axios");

describe("APIProvider", () => {
  const mockData = {
    name: "Test",
    email: "test@test.com",
    log: "Test log",
  };
  const mockResponse = { data: { ...mockData, log: [mockData.log] } };
  const mockError = new Error("Test error");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <APIProvider>
          <div data-testid="child">Hello World!</div>
        </APIProvider>
      </QueryClientProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("updates the list with data and displays a success notification after a successful post", async () => {
    (
      axios.post as jest.MockedFunction<typeof axios.post>
    ).mockResolvedValueOnce(mockResponse);

    render(
      <QueryClientProvider client={queryClient}>
        <APIProvider>
          <LogContext.Consumer>
            {({ handleSubmit }) => (
              <button
                data-testid="submit"
                onClick={() => handleSubmit(mockData)}
              >
                Submit
              </button>
            )}
          </LogContext.Consumer>
          <LogContext.Consumer>
            {({ data }) => (
              <ul>
                {data.log.map((item) => (
                  <li>{item}</li>
                ))}
              </ul>
            )}
          </LogContext.Consumer>
        </APIProvider>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId("submit"));

    await screen.findByText("Submitted successfully");
    await screen.findByText("Test log");
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8000/api/logs",
      mockData
    );
  });

  it("displays an error notification and logs the error after a failed post", async () => {
    (
      axios.post as jest.MockedFunction<typeof axios.post>
    ).mockRejectedValueOnce(mockError);
    const errorConsole = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <APIProvider>
          <LogContext.Consumer>
            {({ handleSubmit }) => (
              <button
                data-testid="submit"
                onClick={() => handleSubmit(mockData)}
              >
                Submit
              </button>
            )}
          </LogContext.Consumer>
        </APIProvider>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId("submit"));

    await screen.findByText("Test error");
    expect(errorConsole).toHaveBeenCalledWith(mockError);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:8000/api/logs",
      mockData
    );
  });
});

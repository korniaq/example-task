import { render, screen } from "@testing-library/react";
import { LogContext } from "../APIProvider/APIProvider";
import LogList from "./LogList";

describe("LogList", () => {
  it("should display a list of items using monospace font", () => {
    const logContextValue = {
      data: { name: "Test", email: "Test", log: ["item1", "item2", "item3"] },
      isLoading: false,
      handleSubmit: jest.fn(),
    };

    render(
      <LogContext.Provider value={logContextValue}>
        <LogList />
      </LogContext.Provider>
    );

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);

    listItems.forEach((item) => {
      expect(item).toHaveStyle("fontFamily: Space Mono, monospace");
    });
  });
});

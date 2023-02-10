import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { NetworkDetails } from "./NetworkDetails";

describe("NetworkDetails component", () => {
  it("should render", async () => {
    // ARRANGE
    render(<NetworkDetails />);

    // ACT
    await userEvent.click(screen.getByText("Load Greeting"));
    await screen.findByRole("heading");

    // ASSERT
    // expect(screen.getByRole("heading")).toHaveTextContent("hello there");
    // expect(screen.getByRole("button")).toBeDisabled();
  });
});

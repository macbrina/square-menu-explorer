import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("lottie-react", () => ({
  default: () => <div data-testid="lottie" />,
}));

import { ErrorState } from "@/components/error-state";

describe("ErrorState", () => {
  it("renders default message", () => {
    render(<ErrorState />);
    expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<ErrorState message="Could not load locations." />);
    expect(screen.getByText("Could not load locations.")).toBeInTheDocument();
  });

  it("shows retry button when onRetry provided", () => {
    render(<ErrorState onRetry={vi.fn()} />);
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("fires onRetry callback", () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    fireEvent.click(screen.getByText("Try again"));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("hides retry button when no callback", () => {
    render(<ErrorState />);
    expect(screen.queryByText("Try again")).not.toBeInTheDocument();
  });

  it("has alert role", () => {
    render(<ErrorState />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

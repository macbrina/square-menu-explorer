import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/search-bar";

describe("SearchBar", () => {
  it("renders with placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search menu items...")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("Search menu items..."), {
      target: { value: "espresso" },
    });
    expect(onChange).toHaveBeenCalledWith("espresso");
  });

  it("shows clear button when value is present", () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("hides clear button when empty", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("clears input on clear button click", () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("announces result count to screen readers", () => {
    render(<SearchBar value="esp" onChange={vi.fn()} resultCount={3} />);
    expect(screen.getByText("3 items found")).toBeInTheDocument();
  });

  it("uses singular for 1 result", () => {
    render(<SearchBar value="esp" onChange={vi.fn()} resultCount={1} />);
    expect(screen.getByText("1 item found")).toBeInTheDocument();
  });
});

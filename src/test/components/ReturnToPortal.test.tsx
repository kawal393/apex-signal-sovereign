import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ReturnToPortal from "@/components/ReturnToPortal";

describe("ReturnToPortal", () => {
  it("renders on non-gate pages", () => {
    render(
      <MemoryRouter initialEntries={["/pricing"]}>
        <ReturnToPortal />
      </MemoryRouter>
    );
    expect(screen.getByText("Portal")).toBeInTheDocument();
  });

  it("hidden on gate page", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ReturnToPortal />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe("");
  });

  it("hidden on commons page", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/commons"]}>
        <ReturnToPortal />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe("");
  });
});

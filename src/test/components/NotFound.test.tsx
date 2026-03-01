import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "@/pages/NotFound";

describe("NotFound page", () => {
  it("renders signal lost heading", () => {
    render(
      <MemoryRouter initialEntries={["/nonexistent"]}>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("SIGNAL")).toBeInTheDocument();
    expect(screen.getByText("LOST")).toBeInTheDocument();
  });

  it("renders return to portal link", () => {
    render(
      <MemoryRouter initialEntries={["/nonexistent"]}>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("Return to Portal")).toBeInTheDocument();
  });

  it("displays attempted route", () => {
    render(
      <MemoryRouter initialEntries={["/ghost-page"]}>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("Route: /ghost-page")).toBeInTheDocument();
  });
});

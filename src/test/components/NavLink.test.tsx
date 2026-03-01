import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NavLink } from "@/components/NavLink";

describe("NavLink", () => {
  it("renders with correct text", () => {
    render(
      <MemoryRouter>
        <NavLink to="/test">Test Link</NavLink>
      </MemoryRouter>
    );
    expect(screen.getByText("Test Link")).toBeInTheDocument();
  });

  it("applies active class when route matches", () => {
    render(
      <MemoryRouter initialEntries={["/active"]}>
        <NavLink to="/active" className="base" activeClassName="active-class">
          Active
        </NavLink>
      </MemoryRouter>
    );
    const link = screen.getByText("Active");
    expect(link).toHaveClass("active-class");
  });

  it("does not apply active class on different route", () => {
    render(
      <MemoryRouter initialEntries={["/other"]}>
        <NavLink to="/target" className="base" activeClassName="active-class">
          Not Active
        </NavLink>
      </MemoryRouter>
    );
    const link = screen.getByText("Not Active");
    expect(link).not.toHaveClass("active-class");
  });
});

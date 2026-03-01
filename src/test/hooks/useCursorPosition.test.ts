import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCursorPosition } from "@/hooks/useCursorPosition";

describe("useCursorPosition", () => {
  it("starts at origin", () => {
    const { result } = renderHook(() => useCursorPosition());
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
    expect(result.current.normalizedX).toBe(0);
    expect(result.current.normalizedY).toBe(0);
  });
});

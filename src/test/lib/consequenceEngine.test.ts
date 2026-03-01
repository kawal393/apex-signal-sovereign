import { describe, it, expect } from "vitest";
import { consequenceEngine } from "@/lib/consequenceEngine";

describe("ConsequenceEngine", () => {
  it("starts with observer status", () => {
    expect(consequenceEngine.getStatus()).toBe("observer");
  });

  it("starts not restricted", () => {
    expect(consequenceEngine.isRestricted()).toBe(false);
  });

  it("starts not delayed", () => {
    expect(consequenceEngine.shouldDelay()).toBe(false);
    expect(consequenceEngine.getDelayRemaining()).toBe(0);
  });

  it("starts with no warning", () => {
    expect(consequenceEngine.getWarning()).toBeNull();
  });

  it("hasRevealed returns false for unknown content", () => {
    expect(consequenceEngine.hasRevealed("random_content")).toBe(false);
  });

  it("getState returns full state object", () => {
    const state = consequenceEngine.getState();
    expect(state).toHaveProperty("isDelayed");
    expect(state).toHaveProperty("warningMessage");
    expect(state).toHaveProperty("accessRestricted");
    expect(state).toHaveProperty("revealedContent");
    expect(state).toHaveProperty("currentStatus");
  });

  it("subscribe returns unsubscribe function", () => {
    const unsub = consequenceEngine.subscribe(() => {});
    expect(typeof unsub).toBe("function");
    unsub();
  });

  it("triggerConsequence: show_warning sets warning", () => {
    consequenceEngine.triggerConsequence("show_warning");
    expect(consequenceEngine.getWarning()).toBe("The system is watching.");
  });
});

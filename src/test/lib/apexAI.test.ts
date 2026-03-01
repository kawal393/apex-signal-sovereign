import { describe, it, expect, vi } from "vitest";

// Mock supabase before importing
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { generateVerdictBrief, classifyVisitor } from "@/lib/apexAI";
import { supabase } from "@/integrations/supabase/client";

describe("generateVerdictBrief", () => {
  it("returns success on valid response", async () => {
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { success: true, assessment: "test", riskScore: 0.5, recommendation: "PROCEED_WITH_CAUTION" },
      error: null,
    });

    const result = await generateVerdictBrief({
      decisionContext: "Test context",
      decisionArea: "compliance",
    });
    expect(result.success).toBe(true);
    expect(result.assessment).toBe("test");
  });

  it("returns error on invoke failure", async () => {
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: null,
      error: { message: "Failed" },
    });

    const result = await generateVerdictBrief({
      decisionContext: "Test",
      decisionArea: "compliance",
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed");
  });

  it("handles thrown errors", async () => {
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

    const result = await generateVerdictBrief({
      decisionContext: "Test",
      decisionArea: "compliance",
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Failed to connect to verdict engine");
  });
});

describe("classifyVisitor", () => {
  it("returns success with data", async () => {
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { currentLevel: "acknowledged", levelChanged: true },
      error: null,
    });

    const result = await classifyVisitor("test-id");
    expect(result.success).toBe(true);
    expect(result.currentLevel).toBe("acknowledged");
  });

  it("returns error on failure", async () => {
    (supabase.functions.invoke as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: null,
      error: { message: "Unauthorized" },
    });

    const result = await classifyVisitor("test-id");
    expect(result.success).toBe(false);
  });
});

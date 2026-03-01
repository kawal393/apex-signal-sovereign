import { describe, it, expect } from "vitest";
import { APEX_NODES, getLiveNodes, getSealedNodes, getDormantNodes, getNodeById } from "@/data/nodes";

describe("APEX_NODES data", () => {
  it("contains nodes", () => {
    expect(APEX_NODES.length).toBeGreaterThan(0);
  });

  it("every node has required fields", () => {
    APEX_NODES.forEach((node) => {
      expect(node.id).toBeTruthy();
      expect(node.name).toBeTruthy();
      expect(["live", "sealed", "dormant"]).toContain(node.status);
      expect(node.purpose).toBeTruthy();
    });
  });

  it("node IDs are unique", () => {
    const ids = APEX_NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getLiveNodes", () => {
  it("returns only live nodes", () => {
    const live = getLiveNodes();
    expect(live.length).toBeGreaterThan(0);
    live.forEach((n) => expect(n.status).toBe("live"));
  });
});

describe("getSealedNodes", () => {
  it("returns only sealed nodes", () => {
    const sealed = getSealedNodes();
    expect(sealed.length).toBeGreaterThan(0);
    sealed.forEach((n) => expect(n.status).toBe("sealed"));
  });
});

describe("getDormantNodes", () => {
  it("returns only dormant nodes", () => {
    const dormant = getDormantNodes();
    expect(dormant.length).toBeGreaterThan(0);
    dormant.forEach((n) => expect(n.status).toBe("dormant"));
  });
});

describe("getNodeById", () => {
  it("finds existing node", () => {
    const node = getNodeById("ndis-watchtower");
    expect(node).toBeDefined();
    expect(node?.name).toBe("APEX NDIS Watchtower");
  });

  it("returns undefined for non-existent node", () => {
    expect(getNodeById("non-existent")).toBeUndefined();
  });
});

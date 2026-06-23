import { describe, expect, it } from "vitest";

import { sessions } from "./workspace";

const domainTerms = [
  "报价",
  "图纸",
  "零件",
  "供应商",
  "quote",
  "drawing",
  "parts",
  "supplier",
];

describe("workspace fixtures", () => {
  it("does not include default example sessions", () => {
    expect(sessions).toEqual([]);
  });

  it("does not include domain-specific examples", () => {
    const fixtureText = JSON.stringify({ sessions }).toLowerCase();

    for (const term of domainTerms) {
      expect(fixtureText).not.toContain(term.toLowerCase());
    }
  });
});

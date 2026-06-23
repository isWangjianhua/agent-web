import { describe, expect, it } from "vitest";

import { artifacts, sessions } from "./workspace";

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
  it("does not include default example sessions or artifacts", () => {
    expect(sessions).toEqual([]);
    expect(artifacts).toEqual([]);
  });

  it("uses generic agent workspace examples", () => {
    const fixtureText = JSON.stringify({ artifacts, sessions }).toLowerCase();

    for (const term of domainTerms) {
      expect(fixtureText).not.toContain(term.toLowerCase());
    }
  });
});

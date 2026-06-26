import { describe, expect, it } from "vitest";
import { makeTask } from "../model/testHelpers";
import { getTaskMetaParts } from "./taskRules";

describe("getTaskMetaParts", () => {
  it("shows queue position for queued tasks", () => {
    const parts = getTaskMetaParts(
      makeTask({ id: "q", status: "queued", queuePosition: 3, credits: 6 }),
    );

    expect(parts).toEqual([
      { text: "позиция 3 в очереди" },
      { text: "6 cr", mono: true },
    ]);
  });

  it("shows ETA for running tasks", () => {
    const parts = getTaskMetaParts(
      makeTask({ id: "r", status: "running", eta: 30, credits: 80 }),
    );

    expect(parts).toEqual([
      { text: "≈ 30 сек", mono: true },
      { text: "80 cr", mono: true },
    ]);
  });

  it("shows done duration for completed tasks", () => {
    const parts = getTaskMetaParts(
      makeTask({ id: "d", status: "done", eta: 12, credits: 25 }),
    );

    expect(parts).toEqual([
      {
        text: "готово за 12 сек",
        className: "text-[12px] text-era-fg-mute",
      },
      { text: "25 cr", mono: true },
    ]);
  });
});

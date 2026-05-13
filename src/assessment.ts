// Month-6 reassessment logic. Deterministic, no LLM call.
// Source: content/REFERENCE_toolkit_adoption.md Block 05.

export type MonthSixInput = {
  working_indicators_present: number; // 0-5 left column
  hitting_limits_indicators_present: number; // 0-5 right column
  notes?: string;
};

export type Verdict = {
  band: "continue" | "split" | "hit-ceiling";
  headline: string;
  action: string;
  next_mcp: string | null;
};

export function assessMonthSix(input: MonthSixInput): Verdict {
  const w = input.working_indicators_present;
  const h = input.hitting_limits_indicators_present;

  // Clear "working" — at least 3 working AND fewer hitting-limits than working
  if (w >= 3 && w > h) {
    return {
      band: "continue",
      headline: "Continue.",
      action:
        "The toolkit is working. Extend the COO mandate to month 12 and pick the next set of workflows. Keep the monthly review cadence. Re-assess at month 12 against the same indicators.",
      next_mcp: null,
    };
  }
  // Clear "hit ceiling" — at least 3 hitting-limits AND fewer working
  if (h >= 3 && h > w) {
    return {
      band: "hit-ceiling",
      headline: "Hit the ceiling.",
      action:
        "The toolkit has gone as far as it can go in this company. You have the data to justify the executive hire — and the political case is now self-evident to your board. Move to cao-hiring-mcp and start the search.",
      next_mcp: "cao-hiring-mcp",
    };
  }
  // Split — mixed signal
  return {
    band: "split",
    headline: "Split — neither column clearly wins.",
    action:
      'The data is mixed. Two paths: (1) Extend by 90 days, sharpen the cadence, run a tighter assessment at month 9. (2) Hybrid — keep the COO mandate inside their functional reach, hire the executive for the cross-functional space where rebuilds are stalling. Don\'t extend indefinitely without a verdict; mixed signal at month 6 turns into "we tried it" at month 12.',
    next_mcp: null,
  };
}

export function formatVerdict(input: MonthSixInput, v: Verdict): string {
  const noteLine = input.notes ? `\n## Notes\n${input.notes.trim()}\n` : "";
  return `# Toolkit Month-6 Reassessment

## Indicators
- Working indicators present: ${input.working_indicators_present}/5
- Hitting-limits indicators present: ${input.hitting_limits_indicators_present}/5

## Verdict
**${v.headline}**

${v.action}
${noteLine}
## Next step
${
  v.next_mcp
    ? `The next MCP in this family: \`${v.next_mcp}\`. Install it and run the corresponding workflow.`
    : "Stay in this MCP — continue the cadence or run the month-9 tighter assessment per the verdict above."
}`;
}

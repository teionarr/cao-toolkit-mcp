import { SKILL_TEXT, REFERENCE_TEXT, KPI_TRACKER_TEMPLATE } from "./content.js";

export type KitOptions = {
  companyContext?: string;
};

export function buildAdoptionKit(opts: KitOptions = {}): string {
  const hintBlock = opts.companyContext
    ? `\nCompany context from user: ${opts.companyContext.trim()}\n`
    : "";

  const closing = `— BEGIN —
Step 1: ask the user which phase they're in. Four phases:
  - Kickoff (about to have the mandate conversation with the COO)
  - First four moves (week 1-4)
  - Operating cadence (month 2-5)
  - Month-6 reassessment

Don't recap the article unless they ask. The full article is loaded above.

Step 2: deliver the right block via the get_block tool. Block ids:
'shape' (Block 01), 'mandate' (Block 02), 'first-moves' (Block 03),
'cadence' (Block 04), 'ceiling' (Block 05), 'today' (Block 06).

Step 3: at month 6, use the assess_month_six tool. Pass the counts of
working vs hitting-limits indicators present.

Step 4: end with the verdict (where applicable) and the next concrete step.
Don't restart the conversation.`;

  return [
    "You are now operating as the Chief Agency Officer toolkit-adoption skill.",
    hintBlock.trim(),
    "",
    "— SKILL INSTRUCTIONS —",
    SKILL_TEXT.trim(),
    "",
    "— REFERENCE: TOOLKIT WITHOUT THE TITLE —",
    REFERENCE_TEXT.trim(),
    "",
    "— TEMPLATE: KPI TRACKER —",
    KPI_TRACKER_TEMPLATE.trim(),
    "",
    closing,
  ]
    .filter((s) => s.length > 0)
    .join("\n");
}

import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { buildAdoptionKit } from "./kit.js";
import { SKILL_TEXT, REFERENCE_TEXT, KPI_TRACKER_TEMPLATE } from "./content.js";
import { getBlock, knownBlockIds } from "./blocks.js";
import { assessMonthSix, formatVerdict } from "./assessment.js";

const SERVER_NAME = "cao-toolkit-adoption";
const SERVER_VERSION = "1.0.0";

export class ToolkitAdoptionMCP extends McpAgent {
  server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  async init() {
    this.server.registerTool(
      "start_toolkit_adoption",
      {
        title: "Start the toolkit-adoption playbook",
        description:
          "Begin coaching the CEO through running the Chief Agency Officer " +
          "toolkit through an existing executive (usually the COO) for six " +
          "months. Returns the skill, the full subarticle, and the KPI tracker " +
          "template, with a directive to ask which phase the user is in " +
          "(kickoff / first-four-moves / cadence / month-6 reassessment).",
        inputSchema: {
          company_context: z
            .string()
            .max(500)
            .optional()
            .describe(
              "Optional one-line note about the company (e.g. 'Series-B B2B " +
                "SaaS, 200 employees, COO is the right candidate'). Helps " +
                "anchor the coaching."
            ),
        },
      },
      async ({ company_context }) => ({
        content: [
          {
            type: "text",
            text: buildAdoptionKit({ companyContext: company_context }),
          },
        ],
      })
    );

    this.server.registerTool(
      "get_block",
      {
        title: "Get one block of the toolkit playbook",
        description:
          "Return one block of the playbook. Use this to fetch one slice at " +
          "a time instead of loading everything into context. Block ids: " +
          "'shape' (Block 01), 'mandate' (Block 02), 'first-moves' (Block 03), " +
          "'cadence' (Block 04), 'ceiling' (Block 05), 'today' (Block 06). " +
          "Numeric aliases also accepted ('1' through '6').",
        inputSchema: {
          block: z
            .string()
            .describe(
              "Block id. Examples: 'shape', 'mandate', 'first-moves', " +
                "'cadence', 'ceiling', 'today'. Or numeric: '1'..'6'."
            ),
        },
      },
      async ({ block }) => {
        const b = getBlock(block);
        if (!b) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text:
                  `Unknown block '${block}'. ` +
                  `Known: ${knownBlockIds().join(", ")}. ` +
                  `Numeric aliases ('1'..'6') accepted.`,
              },
            ],
          };
        }
        return {
          content: [{ type: "text", text: `## ${b.title}\n\n${b.body}` }],
        };
      }
    );

    this.server.registerTool(
      "assess_month_six",
      {
        title: "Assess the month-6 toolkit verdict",
        description:
          "Apply Block 05 (Ceiling indicators) honestly. Pass the count of " +
          "'working' indicators present (left column, 0-5) and the count of " +
          "'hitting limits' indicators present (right column, 0-5). Returns the " +
          "verdict — Continue / Split / Hit the ceiling — and the recommended " +
          "next concrete step.",
        inputSchema: {
          working_indicators_present: z
            .number()
            .int()
            .min(0)
            .max(5)
            .describe(
              "Count of left-column indicators that are HONESTLY present. " +
                "Don't grade generously."
            ),
          hitting_limits_indicators_present: z
            .number()
            .int()
            .min(0)
            .max(5)
            .describe(
              "Count of right-column indicators that are HONESTLY present. " +
                "Don't grade generously."
            ),
          notes: z
            .string()
            .max(2000)
            .optional()
            .describe("Optional free-text notes — specifics, data sources, confidence."),
        },
      },
      async ({ working_indicators_present, hitting_limits_indicators_present, notes }) => {
        const verdict = assessMonthSix({
          working_indicators_present,
          hitting_limits_indicators_present,
          notes,
        });
        return {
          content: [
            {
              type: "text",
              text: formatVerdict(
                { working_indicators_present, hitting_limits_indicators_present, notes },
                verdict
              ),
            },
          ],
        };
      }
    );

    this.server.registerPrompt(
      "toolkit-adoption",
      {
        title: "Run the toolkit-adoption playbook",
        description:
          "Coach the CEO through the 6-month toolkit-without-the-title arc.",
        argsSchema: {
          company_context: z.string().max(500).optional(),
        },
      },
      ({ company_context }) => ({
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: buildAdoptionKit({ companyContext: company_context }),
            },
          },
        ],
      })
    );

    this.server.registerResource(
      "skill",
      "skill://cao-toolkit-adoption",
      {
        title: "Toolkit adoption skill",
        description:
          "The coaching skill: phase placement, block delivery, risk surfacing, " +
          "month-6 reassessment.",
        mimeType: "text/markdown",
      },
      async (uri) => ({
        contents: [{ uri: uri.href, mimeType: "text/markdown", text: SKILL_TEXT }],
      })
    );

    this.server.registerResource(
      "reference",
      "reference://toolkit-without-title",
      {
        title: "Toolkit-without-the-title (article)",
        description: "Full text of the subarticle.",
        mimeType: "text/markdown",
      },
      async (uri) => ({
        contents: [{ uri: uri.href, mimeType: "text/markdown", text: REFERENCE_TEXT }],
      })
    );

    this.server.registerResource(
      "kpi-tracker-template",
      "template://kpi-tracker",
      {
        title: "KPI baseline & target tracker",
        description:
          "Printable tracker covering the seven metrics (revenue per employee, " +
          "gross margin per employee, cost per dollar of revenue, decision latency, " +
          "agency-weighted hires, tenure-to-impact correlation, plus growth rate).",
        mimeType: "text/markdown",
      },
      async (uri) => ({
        contents: [
          { uri: uri.href, mimeType: "text/markdown", text: KPI_TRACKER_TEMPLATE },
        ],
      })
    );
  }
}

const LANDING_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>CAO Toolkit Adoption MCP</title>
  <style>
    :root { color-scheme: light dark; }
    body { font: 16px/1.6 -apple-system, system-ui, sans-serif; max-width: 640px; margin: 4rem auto; padding: 0 1.5rem; }
    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    @media (prefers-color-scheme: dark) { pre { background: #1a1a1a; } }
    h1 { margin-bottom: 0.25rem; }
    .sub { color: #666; margin-top: 0; }
  </style>
</head>
<body>
  <h1>CAO: Toolkit Adoption MCP</h1>
  <p class="sub">Run the Chief Agency Officer playbook through an existing exec for 6 months — then decide.</p>

  <h2>Install (Claude Code, one command)</h2>
  <pre>claude mcp add cao-toolkit --transport http \\
  https://cao-toolkit-mcp.levitin.workers.dev/mcp</pre>

  <p>Other clients: see the <a href="https://github.com/teionarr/cao-toolkit-mcp">README</a>.</p>

  <p>Article: <a href="https://ai-lead.levitin.io/chief-agency-officer/">ai-lead.levitin.io/chief-agency-officer</a></p>
</body>
</html>`;

type Env = Record<string, unknown>;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return ToolkitAdoptionMCP.serveSSE("/sse").fetch(request, env, ctx);
    }
    if (url.pathname === "/mcp") {
      return ToolkitAdoptionMCP.serve("/mcp").fetch(request, env, ctx);
    }
    if (url.pathname === "/healthz") {
      return new Response("ok", { status: 200, headers: { "content-type": "text/plain" } });
    }
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(LANDING_HTML, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" },
      });
    }
    return new Response("Not found", { status: 404 });
  },
};

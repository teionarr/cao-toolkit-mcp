<h1 align="center">CAO: Toolkit Adoption MCP</h1>

<p align="center">
  <b>One URL. Any LLM. Run the Chief Agency Officer playbook through your existing exec — no hire required, six months to know.</b>
</p>

<p align="center">
  <a href="https://cao-toolkit-mcp.levitin.workers.dev"><img alt="Live" src="https://img.shields.io/badge/live-cao--toolkit--mcp.levitin.workers.dev-00C7B7?style=flat-square"></a>
  <img alt="MCP" src="https://img.shields.io/badge/MCP-Streamable_HTTP-7C3AED?style=flat-square">
  <img alt="Cloudflare" src="https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
</p>

---

## What this is

For companies that have read [The Chief Agency Officer](https://ai-lead.levitin.io/chief-agency-officer/) and concluded: **convinced of the framework, not yet hiring**. Either you scored 2–5 on the exec conversation diagnostic, or you read the article cold and decided to run the toolkit first.

This MCP coaches you through that arc: give your COO the friction-removal mandate, run the first four moves, operate the monthly/quarterly cadence, reassess at month 6 against the value KPIs. Same instruments as a full CAO hire, lower political cost. Six months from now you'll know whether to make the hire — and you'll have the data to justify it either way.

The MCP delivers a battle-tested skill, the full subarticle, the seven-metric KPI tracker, and deterministic month-6 reassessment logic into whatever LLM you're already paying for. Free to run, identical across Claude / ChatGPT / Gemini.

---

## Install in 30 seconds

### Claude Code (one command)

```bash
claude mcp add cao-toolkit --transport http \
  https://cao-toolkit-mcp.levitin.workers.dev/mcp
```

Restart Claude Code. The `start_toolkit_adoption` tool and `toolkit-adoption` prompt will appear.

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "cao-toolkit": {
      "url": "https://cao-toolkit-mcp.levitin.workers.dev/mcp"
    }
  }
}
```
</details>

<details>
<summary><b>Claude.ai (web)</b></summary>

Settings → **Connectors** → **Add custom connector** → paste:

```
https://cao-toolkit-mcp.levitin.workers.dev/mcp
```
</details>

<details>
<summary><b>ChatGPT</b> (Pro / Team / Enterprise)</summary>

Settings → **Connectors** → **Custom MCP** → paste the URL above.
</details>

<details>
<summary><b>Gemini CLI</b></summary>

`~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "cao-toolkit": {
      "httpUrl": "https://cao-toolkit-mcp.levitin.workers.dev/mcp"
    }
  }
}
```
</details>

---

## How to use it

Four phases. The MCP picks the right behavior from how you describe where you are.

```
You: I'm having the 30-min mandate conversation with my COO this week — prep me.
LLM: [calls start_toolkit_adoption + get_block("mandate") — gives you the
      5 mandate components and the agenda for the meeting]
```

```
You: We're 6 weeks in. The COO is at the "pick the first workflow" step
     but everyone's lobbying for their pet project.
LLM: [calls get_block("first-moves"), reminds you the first workflow has
      to be unambiguous and unguarded — surfaces the political-loading risk]
```

```
You: It's month 6. We hit revenue per employee +12% but two function heads
     are openly resisting and the COO is asking for authority I didn't budget.
LLM: [calls assess_month_six(2, 3) → "Hit the ceiling" verdict, recommends
      cao-hiring-mcp as the next step]
```

The reassessment comes with a clear verdict — Continue, Split, or Hit the ceiling — and the next concrete step.

---

## What gets loaded

| Artifact | What it is |
|---|---|
| **Skill** | How to coach the CEO through the four phases (kickoff / first-four-moves / cadence / month-6 reassessment). |
| **Reference** | Full text of the article — shape of the move, mandate content, first four moves, operating cadence, ceiling indicators, what to do today. |
| **KPI tracker** | Seven-metric tracker (Tier 1 value, Tier 2 velocity & cost, Tier 3 leading indicators) with baseline and month-6 target columns. |

Use `get_block` to fetch one block at a time — `shape`, `mandate`, `first-moves`, `cadence`, `ceiling`, `today`. Numeric aliases (`1`..`6`) also work.

---

## The month-6 verdict

The MCP computes the verdict deterministically from your honest count of indicators present.

```markdown
# Toolkit Month-6 Reassessment

## Indicators
- Working indicators present: 2/5
- Hitting-limits indicators present: 3/5

## Verdict
**Hit the ceiling.**

The toolkit has gone as far as it can go in this company. You have the
data to justify the executive hire — and the political case is now
self-evident to your board. Move to cao-hiring-mcp and start the search.

## Next step
The next MCP in this family: `cao-hiring-mcp`.
```

The scoring honors the article's logic: 3+ working indicators (and more working than limits) → Continue; 3+ hitting-limits indicators (and more limits than working) → Hit the ceiling; everything else → Split, with a named path forward.

---

## What the server exposes

| Type | Name | Description |
|---|---|---|
| Tool | `start_toolkit_adoption` | Returns the full kit + a directive to ask which phase you're in. Optional `company_context` hint. |
| Tool | `get_block` | Args: `block` (one of `shape`, `mandate`, `first-moves`, `cadence`, `ceiling`, `today`; or `1`..`6`). Returns just that block. |
| Tool | `assess_month_six` | Args: `working_indicators_present` 0–5, `hitting_limits_indicators_present` 0–5, optional `notes`. Returns the verdict. |
| Prompt | `toolkit-adoption` | Same as the start tool. |
| Resource | `skill://cao-toolkit-adoption` | The coaching skill. |
| Resource | `reference://toolkit-without-title` | The article body. |
| Resource | `template://kpi-tracker` | The 7-metric KPI tracker template. |

---

## Privacy

- **No authentication.** Public read-only endpoint.
- **No tracking.** No analytics, no per-user logs.
- **No data uploads.** The server only sees that a tool was called, not what's being discussed. The reassessment is computed deterministically from the two integer counts you pass — your KPI numbers never leave your LLM.

---

## Run your own copy

```bash
git clone git@github.com:teionarr/cao-toolkit-mcp.git
cd cao-toolkit-mcp
npm install
npx wrangler login
npm run deploy
```

Free Cloudflare account is enough.

---

## The four-MCP family

| # | Card | MCP | URL |
|---|---|---|---|
| 01 | How to talk to your exec team | [cao-exec-conversation](https://github.com/teionarr/cao-exec-conversation-mcp) | `https://cao-exec-conversation-mcp.levitin.workers.dev/mcp` |
| 02 | Adopt the toolkit without the title | **cao-toolkit** (this) | `https://cao-toolkit-mcp.levitin.workers.dev/mcp` |
| 03 | Hiring a Chief Agency Officer | [cao-hiring](https://github.com/teionarr/cao-hiring-mcp) | `https://cao-hiring-mcp.levitin.workers.dev/mcp` |
| 04 | Hiring agency-first people | [cao-agency-first-hiring](https://github.com/teionarr/cao-agency-first-hiring-mcp) | `https://cao-agency-first-hiring-mcp.levitin.workers.dev/mcp` |

Umbrella repo: [chief-agency-officer](https://github.com/teionarr/chief-agency-officer).

---

## License

MIT. The skill, reference, and templates are based on original work by [@teionarr](https://github.com/teionarr) at [ai-lead.levitin.io](https://ai-lead.levitin.io).

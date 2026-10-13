# Evaluation CI (V7)

How the evaluation system is gated in CI. Architecture and metric semantics
live in [EVALUATION.md](EVALUATION.md); this page is the CI strategy, the
workflows, and how to promote baselines.

## Strategy at a glance

| Trigger | Workflow | What runs | Cost | Gate? |
|---|---|---|---|---|
| Manual dispatch | `eval-smoke.yml` | `eval:smoke` — fixture mode, deterministic evaluators, ~15 high-value regression/golden cases | $0, no LLM calls, no network | Fails on regression |
| Nightly 03:17 UTC (opt-in) + manual dispatch | `eval-nightly.yml` | `eval:full` — entire benchmark, live providers, LLM judge | API credits | No — report artifact only |
| Release experiments (manual) | run `eval:full` / targeted experiments locally or via `eval-nightly.yml` dispatch | model/strategy comparisons | API credits | No |

Expensive cloud/live eval **never** runs on every commit (spec §73, §79);
The current `pr.yml` runs type checks, workspace tests and secret scanning;
the standalone fixture smoke workflow is manual-only.

## Why fixture-only on PR (spec §74)

- **Determinism.** Fixture cases evaluate against canned inputs and expected
  outputs; the same commit produces the same scores. No market-data flakiness
  — a live-format eval can fail on bad tick data or a provider hiccup with
  zero signal about the change under test.
- **Zero cost.** No API spend per commit. Live evals burn credits on every
  push; fixture evals are free and fast (minutes).
- **Speed.** The gate stays under ~minutes so it does not slow the loop.
- **Security.** The smoke workflow runs on PRs from forks with no secrets in
  scope — safe by construction because fixture mode has no credentialed
  dependencies.

Live/cloud evals are still run — just on the nightly cadence or manually,
where cost and flakiness are acceptable and the results feed the metrics
dashboard and baseline promotion.

## Workflows

### `.github/workflows/eval-smoke.yml` — manual fixture regression

- Trigger: `workflow_dispatch`.
- Steps: checkout → setup Bun (`oven-sh/setup-bun@v2`) → `bun install
  --frozen-lockfile` → `bun run eval:smoke -- --mode fixture --out
  artifacts/eval-smoke.json` → upload the JSON artifact.
- The CLI exits `0` on pass and `1` on gate failure (metric regression past
  `maxDelta`) or run error; a non-zero exit fails the manual job.
- `concurrency` group cancels superseded runs on the same PR/branch.

### `.github/workflows/eval-nightly.yml` — nightly + manual full eval

- Triggers: `schedule` (daily `17 3 * * *` UTC) and `workflow_dispatch`
  (for release/manual experiments).
- Scheduled jobs run only when the repository variable
  `FINAGENT_LIVE_EVAL_ENABLED` is exactly `true`. Leave it unset while live
  dependencies are unconfigured. A skipped schedule means **not evaluated**,
  not a passing live benchmark. Manual dispatch always runs the real preflight
  and still fails on unavailable providers, credentials or market data.
- Runner: `FINAGENT_EVAL_RUNNER` selects a configured runner label; defaults
  to `ubuntu-latest`. Use a dedicated runner label with an installed and
  authenticated LongBridge CLI when enabling nightly eval. This workflow
  does not install or authenticate that user-managed dependency.
- Steps: checkout → setup Bun → install → `bun run eval:full -- --mode live
  --model <provider>/<id> --judge-provider anthropic --judge-model <id>
  --out artifacts/eval-full.json`, with
  `LANGSMITH_PI_API_KEY`, `ANTHROPIC_API_KEY`, and `FINAGENT_JUDGE_API_KEY`
  passed through from repo secrets (never echoed, never logged). The model
  defaults to `anthropic/claude-sonnet-4-5` and can be overridden via the
  `FINAGENT_EVAL_MODEL` / `FINAGENT_JUDGE_MODEL` repository variables.
- Before any case runs, the CLI executes a **live preflight** (issue #113):
  Pi runtime health, model availability, a one-token credential probe, the
  LongBridge data source, and judge readiness. A missing install or credential
  is an explicit `invalid` state (exit `2`), never a suite that "ran" with
  zero tool calls.
- No `continue-on-error`, and the step runs under `set -o pipefail`: the
  `| tee` pipeline keeps the CLI's real exit code (`0` valid · `1` quality
  regression/usage · `2` invalid or inconclusive execution · `3` cancelled),
  so a failed run fails the job while the summary and artifacts still upload.
- The workflow creates `artifacts/` before opening the log through `tee`;
  the CLI also creates parent directories for its JSON output. Missing output
  directories therefore do not replace an invalid preflight's exit `2` with
  an `ENOENT` crash.
- Report steps (no issue automation): a summary step greps the printed
  validity/execution table into `$GITHUB_STEP_SUMMARY`, and the JSON artifact
  plus run log are uploaded (both on success and failure).

Before opting in, configure the `ANTHROPIC_API_KEY` secret (used for the
default agent and judge), any required runtime credentials, and the runner's
LongBridge authentication. Keep credentials out of source control. Until then,
use the manual fixture smoke workflow for a check that needs no live services.

## Baselines & promotion

Baseline JSON (dataset version, metrics, per-metric `maxDelta` thresholds) is
seeded from committed files in `scripts/eval/ci-baselines/`
(see `scripts/eval/ci-baselines/README.md` for the format). `folio-agent-v1`
is currently a placeholder with empty metrics; the lead seeds real values
from the first smoke baseline run.

To promote a new/updated baseline:

1. Run the full benchmark locally:
   `bun run eval:full -- --mode live --model <provider>/<id> --judge-provider anthropic --judge-model <id> --save-baseline <name>`
   (only `valid` experiments can seed a baseline — invalid/inconclusive runs
   are refused; see the CLI `--help` for exact flags).
2. Copy the saved JSON into `scripts/eval/ci-baselines/<datasetVersion>.json`.
3. Review `thresholds` before committing: tight enough to catch real
   regressions, loose enough for evaluator noise at the dataset sample size.
4. Commit with a message explaining why expectations changed (dataset bump,
   evaluator fix, new regression cases, …).

## Cost guardrails

- Fixture PR gate: zero API cost by construction (spec §74).
- Live eval: nightly cadence only, on-demand for experiments — never a
  per-commit trigger (spec §73, §79).
- All live runs cap spend via the CLI's `--max-cases`, sampling, concurrency
  and `--timeout-ms` flags; the nightly workflow relies on sane defaults and
  reviewers should keep them sane when dispatching manually.
- Secrets are passed through env from repo secrets only; the workflows never
  echo them or write them to logs.

# Bundled Longbridge Skills

Bundled Longbridge skill packages, distributed under the MIT License (© 2026 Longbridge Inc.; see [LICENSE](LICENSE)). Browse the bundled copies in [this repository](https://github.com/yftx293/folio/tree/main/skills).

- `index.json` — metadata index for the packages bundled in this repository.
- Each `<name>/` directory is a skill package: `SKILL.md` + `references/` (+ optional `scripts/`, `assets/`).
- Skills are loaded by `@finagent/skill-hub` (SkillHub V2) and consumed progressively by the agent.

## Update procedure

```bash
git clone --depth 1 https://github.com/yftx293/folio.git /tmp/folio-skills
cp -r /tmp/folio-skills/skills/. skills/
```

The bundled snapshot was captured on 2026-08-13. Review package changes and retain the included license when updating it.

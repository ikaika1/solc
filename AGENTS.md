# Repository Guidelines


## Project Structure & Module Organization
- `packages/solc/src`: Main CLI (Solana validator utilities); commands under `src/cli/<topic>/<command>.ts`, configs in `src/config`, helpers in `src/lib`, i18n in `src/locales`.
- `packages/solc/tests`: Vitest tests for the CLI.
- `packages/ui/src`: Internal UI library components (used by docs/website tooling).
- `packages/eslint-config`, `packages/typescript-config`: Shared lint/TS configs.
- `lib/`: Maintenance scripts (e.g., Discord changelog runner).
- `resource/`: Release and install assets.
- `website/`: Marketing/docs site.

## Build, Test, and Development Commands
- `pnpm i`: Install workspace dependencies (Node >= 20, pnpm >= 9).
- `pnpm build`: Build all packages via Turborepo.
- `pnpm -F "@ily-validator/solc" build`: Build the CLI only (tsup -> `dist/index.js`).
- `pnpm dev`: Run workspace dev tasks (watch where supported).
- `pnpm test`: Run tests (depends on builds).
- `pnpm lint`: Lint all packages.
- Example local run: `node packages/solc/dist/index.js --help` or `pnpm -F "@ily-validator/solc" start`.

## Coding Style & Naming Conventions
- Language: TypeScript (ESM). Indent 2 spaces.
- Prettier: no semicolons, single quotes (`.prettierrc`).
- ESLint: shared configs under `packages/eslint-config` + package-level overrides.
- Naming: files/functions `camelCase`, classes `PascalCase`, constants `UPPER_SNAKE`.
- CLI command files live in `src/cli/<topic>/<command>.ts` (keep names short and action-oriented).

## Testing Guidelines
- Framework: Vitest (`packages/solc`).
- Location/pattern: `packages/solc/tests/**/*.test.ts`.
- Run: `pnpm -F "@ily-validator/solc" test` or `pnpm test` (workspace).
- Aim to cover new CLI flags, error paths, and core flows; prefer fast, unit-level tests around helpers.

## Commit & Pull Request Guidelines
- Commits: concise, imperative subject; include scope when helpful (e.g., `solc:`). Reference issues like `#123` when applicable.
- Versioning: use Changesets. Create one with `pnpm changeset`; CI runs `ci:version`/`ci:publish`.
- PRs: include description, motivation, screenshots/logs for user-visible changes, test coverage, and linked issues. Ensure `pnpm build`, `pnpm test`, and `pnpm lint` pass.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local` files; Turborepo tracks `**/.env.*local` as global deps.
- Validate external commands and file writes in CLI code; prefer explicit paths under the user’s home or temp.

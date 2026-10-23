# GitHub Actions maintenance

This guide describes the checked-in workflows. Follow each linked YAML file for branch filters, job dependencies, permissions, and release conditions.

## Workflows

| Workflow                           | Events                      | Jobs               |
| ---------------------------------- | --------------------------- | ------------------ |
| [ci.yml](workflows/ci.yml)         | `push`, `pull_request`      | `lint-typecheck`   |
| [static.yml](workflows/static.yml) | `push`, `workflow_dispatch` | `build-and-deploy` |

## Parallel steps

Independent checks use GitHub Actions [native parallel steps](https://github.blog/changelog/2026-06-25-actions-steps-can-now-be-run-in-parallel/). The following groups run concurrently within a job:

- [ci.yml](workflows/ci.yml), job `lint-typecheck`: `Formatting`; `Bun check`; `Test`; `Audit`.
- [static.yml](workflows/static.yml), job `build-and-deploy`: `Check formatting`; `Bun check`; `Test`; `Audit`.

Steps after a group wait for it to finish. Keep prerequisites before the group and dependent build, package, or deployment work afterward. Do not run commands that overwrite the same build directory or coverage output together. Parallel steps share the job workspace; they do not provide separate machines.

## Action versions

Verified against upstream stable releases on 2026-10-22. Workflow, composite-action,
and release-proposal references use immutable commit pins with version comments.

| Action                                                                            | Stable release | Commit                                     |
| --------------------------------------------------------------------------------- | -------------- | ------------------------------------------ |
| [actions/cache](https://github.com/actions/cache)                                 | `v6.1.0`       | `55cc8345863c7cc4c66a329aec7e433d2d1c52a9` |
| [actions/checkout](https://github.com/actions/checkout)                           | `v7.0.1`       | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| [actions/configure-pages](https://github.com/actions/configure-pages)             | `v6.0.0`       | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` |
| [actions/deploy-pages](https://github.com/actions/deploy-pages)                   | `v5.0.1`       | `368f82528645a54fb793d4d04e342629a3f51346` |
| [actions/setup-node](https://github.com/actions/setup-node)                       | `v7.1.0`       | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) | `v5.0.0`       | `fc324d3547104276b827a68afc52ff2a11cc49c9` |
| [oven-sh/setup-bun](https://github.com/oven-sh/setup-bun)                         | `v2.2.0`       | `0c5077e51419868618aeaa5fe8019c62421857d6` |

## Greenkeeping

[Dependabot configuration](dependabot.yml) checks GitHub Actions weekly and groups their updates. Review the upstream release notes, runtime requirements, permissions, and changes to inputs or artifact behavior before merging. Update SHA pins to the release commit, retaining the version comment where present.

1. Update every reference to the affected action, including local composite actions under `.github/actions/`.
2. Keep frozen dependency installation and the repository’s declared toolchain versions aligned. Cache package downloads with a lockfile-based key; a cache hit does not replace installation or verification.
3. Check workflow YAML and review shell commands. Older workflow linters may not understand native `parallel`; GitHub execution must verify those groups.
4. Run the affected checks and inspect the resulting Actions run. Preserve matrix coverage, build dependencies, artifact paths, and release gates.
5. Refresh this guide when workflows, action references, or parallel groups change.

Use workflow concurrency to cancel superseded check runs where appropriate. Deployment and release cancellation have different consequences: preserve the workflow’s existing policy rather than copying check-run settings blindly. Repository permissions and job-level overrides are defined in the linked YAML files.

## Bun tooling

Bun 1.4.4 provides native formatting and type checking. CI runs
`bun run format:check` and `bun run typecheck`; Biome is no longer installed.
Semantic lint rules previously supplied by Biome are not part of Bun formatting.
Retain tests, declaration generation, package validation, and audit gates.

Frozen dependency installation uses `bun ci`. Vitest and declaration emitters
remain where they provide existing coverage and published package artifacts.

## Check and build order

Local `check:source` uses Bun’s parallel script runner for formatting, project
checking, and tests. GitHub keeps these as independent parallel steps so failures
remain visible. Builds and package checks wait for the source checks.
Standalone `build` runs Bun checking first. After an explicit successful checker,
CI uses `build:artifacts`; its TypeScript step emits declarations with `--noCheck`
and does not provide a second semantic check.

Package artifact commands host their existing build tools under Bun. Source gates
still finish before artifact generation; tests and coverage keep their existing
runtime. Bun package caches use the default `~/.bun/install/cache` directory.
See [build performance](../docs/build-performance.md) for the controlled comparison.

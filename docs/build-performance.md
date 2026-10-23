# Build performance

The artifact build runs its existing tools under Bun 1.4.4. This changes the build
host, while preserving the package's exports and output formats. Tests and
coverage retain their existing runtime; source checks still finish before builds.

On the Linux x64 executor (Node v26.11.1, Bun 1.4.4), the median artifact-build time
changed from **3.804s to 3.551s**, a **6.7% reduction** for this phase.

| Build host             | Median |        Range |
| ---------------------- | -----: | -----------: |
| Node tool shebangs     | 3.804s | 3.322–3.972s |
| Bun-hosted build tools | 3.551s | 3.385–3.841s |

Both cases used the same updated dependencies and included declaration emission.
One warm-up per case preceded three alternating measured runs. All emitted files,
including declarations and source maps, had identical SHA-256 fingerprints across
the measured cases. Dependency and OS caches were warm. No other build or test
workload ran during this comparison. This excludes dependency installation, source
checks, tests, Storybook, and CI setup; it is not a whole-CI speedup measurement.

[Raw samples](benchmarks/build-runtime-2026-10-22.json) retain the baseline commit,
tool versions, individual timings, file counts, fingerprints, and candidate command.
The recorded commands refer to the baseline scripts before explicit Bun invocations
were added. Current package scripts select the measured Bun-hosted path directly.

To time the current build, install pinned dependencies with `bun ci`, finish the
source checks, then run `bun run build:artifacts` repeatedly on an otherwise idle machine.
Compare medians and emitted files; do not combine this phase result with historical
checker improvements to claim a multiplied whole-build gain.

The obsolete `bunfig.toml` was removed. Its repository-local `.bun-cache` setting
did not match Actions’ restored `~/.bun/install/cache` directory. Defaults now
match CI. Unsupported Jest-runner and TypeScript-cache settings were removed;
Vitest remains the actual test runner. React 18 compatibility is preserved.

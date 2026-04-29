# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.8.1](https://github.com/vanityURLs/website/compare/v2.8.0...v2.8.1) (2026-04-29)


### Performance Improvements

* emit font preloads, batch reading-progress writes, fix hero contrast ([9a1e09f](https://github.com/vanityURLs/website/commit/9a1e09ff4305a48b6901f40425bf118d01488df9))

## [2.8.0](https://github.com/vanityURLs/website/compare/v2.7.1...v2.8.0) (2026-04-29)


### Features

* capture UTMs in analytics; self-host mermaid; tighten CSP ([67bc56b](https://github.com/vanityURLs/website/commit/67bc56b86d7eb9d33f4cac15a81143c06c7eb788))

## [2.7.1](https://github.com/vanityURLs/website/compare/v2.7.0...v2.7.1) (2026-04-29)


### Bug Fixes

* **tags:** repair term pages broken since Hugo 0.146; drop unused categories taxonomy ([acce3bd](https://github.com/vanityURLs/website/commit/acce3bd08614965f01464eaacd87d6d521e67dfa))

## [2.7.0](https://github.com/vanityURLs/website/compare/v2.6.1...v2.7.0) (2026-04-25)


### Features

* dark chroma + trust copy + bot tagging; rename worker ([441dcad](https://github.com/vanityURLs/website/commit/441dcad5aa5097ee1114caac45cd57bc24555370))

## [2.6.1](https://github.com/vanityURLs/website/compare/v2.6.0...v2.6.1) (2026-04-25)


### Bug Fixes

* **build:** rename worker to .mjs to free postcss/tailwind from type:module ([de7defb](https://github.com/vanityURLs/website/commit/de7defb6447092ed56fc184b849f931bfdcb086b))

## [2.6.0](https://github.com/vanityURLs/website/compare/v2.5.0...v2.6.0) (2026-04-25)


### Features

* update static/social.png and add tool to regenerate if required ([e0700b0](https://github.com/vanityURLs/website/commit/e0700b0647a93e9dc91c4632906bbbde636b4e5f))

## [2.5.0](https://github.com/vanityURLs/website/compare/v2.4.2...v2.5.0) (2026-04-25)


### Features

* Handles HTML/GET detection ([aa3285c](https://github.com/vanityURLs/website/commit/aa3285c6fe850cb4c5a8e1b490aea3f10f9595ee))
* security.txt rotation reminder (.github/workflows/security-txt-reminder.yml) — daily check that opens an issue 90 days before Expires. ([66c0b29](https://github.com/vanityURLs/website/commit/66c0b29cf1e57fb79957ad516f682931caeb315c))

## [2.4.2](https://github.com/vanityURLs/website/compare/v2.4.1...v2.4.2) (2026-04-24)


### Bug Fixes

* **csp:** drop unsafe-inline from style-src ([839b709](https://github.com/vanityURLs/website/commit/839b70913e0c4d155dbe9f679c007542a997f60f))

## [2.4.1](https://github.com/vanityURLs/website/compare/v2.4.0...v2.4.1) (2026-04-24)


### Bug Fixes

* **404:** remove broken content templates; rename all yaml to yml ([509673c](https://github.com/vanityURLs/website/commit/509673c8759c6296693cc43472b0dc986c1d2d54))

## [2.4.0](https://github.com/vanityURLs/website/compare/v2.3.1...v2.4.0) (2026-04-24)


### Features

* data-driven homepage ([61f8b51](https://github.com/vanityURLs/website/commit/61f8b51f81996e30b35643af9674ee9606fe6888))

## [2.3.1](https://github.com/vanityURLs/website/compare/v2.3.0...v2.3.1) (2026-04-24)


### Bug Fixes

* font preload-to-CSS-request race ([454dd24](https://github.com/vanityURLs/website/commit/454dd24301f994467b9e5ac3f739b8c0727e3254))

## [2.3.0](https://github.com/vanityURLs/website/compare/v2.2.0...v2.3.0) (2026-04-24)


### Features

* self-host fonts (Inter + JetBrains Mono) ([5d2fed2](https://github.com/vanityURLs/website/commit/5d2fed2df5de9ea835d69d6c9241728670d5d917))

## [2.2.0](https://github.com/vanityURLs/website/compare/v2.1.2...v2.2.0) (2026-04-24)


### Features

* CSP hardening only ([171b557](https://github.com/vanityURLs/website/commit/171b557ca5304e9c3b281df5e13e786fc76d852d))
* moved index text to data/home ([0aa7a5d](https://github.com/vanityURLs/website/commit/0aa7a5d076c99a1dcdbd48a631b5f43f62af0910))

## [2.1.2](https://github.com/vanityURLs/website/compare/v2.1.1...v2.1.2) (2026-04-24)


### Bug Fixes

* 18n issues and a drift release number in package.json ([7bf9cc0](https://github.com/vanityURLs/website/commit/7bf9cc057d70d24226a9ff843de05d6c51f4b370))
* multiple items identified below Fix 1 — RSS feed (delete custom template, use Hugo internal)Delete broken custom RSS templateDelete broken custom RSS template ([cc3a8a1](https://github.com/vanityURLs/website/commit/cc3a8a1a0a89ccda00ad1025a8710999329ae6c4))

## [2.1.1](https://github.com/vanityURLs/website/compare/v2.1.0...v2.1.1) (2026-04-23)


### Bug Fixes

* i18n bug ([fa7b7be](https://github.com/vanityURLs/website/commit/fa7b7be7bc8fae4c50611d7adb27292fadca0c31))
* i18n bug ([76844eb](https://github.com/vanityURLs/website/commit/76844eb4563947d4bc97a64fbedd71baa108c72b))

## [2.1.0](https://github.com/vanityURLs/website/compare/v2.0.0...v2.1.0) (2026-04-08)


### Features

* new hugo structure & content ([1ae485c](https://github.com/vanityURLs/website/commit/1ae485cba1ab092c82159a3e8744e89832aed816))

## [Unreleased]
### Added
- Husky + Commitlint setup for Conventional Commits <-- Work in progres

### Changed
- Documentation refined for clarity and consistency

### Fixed
- N/A

## [0.1.0] - 2025-09-21 – First public release of the template repository
### Added
- Initial repository template structure
- Standard community files: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `MAINTAINERS.md`, `SECURITY.md`, `SUPPORT.md`, `CODEOWNERS`
- MIT license
- GitHub issue and PR templates (bug, docs, feature request, question/support, security)
- Pull request template
- Label definitions (`labels.yml`) for type, status, and priority
- `.editorconfig` for consistent coding styles
- `.gitignore` for ignoring common files
- `.gitattributes` for diff and linguist configuration
- `.markdownlint.yml` for Markdown style checking
- `README.md` with usage instructions, image guidelines, and references
- `/docs/` folder with best practices, badges, emojis, and visuals
- `CHANGELOG.md` using Keep a Changelog format
- `package.json` with Node.js modules and repository metadata

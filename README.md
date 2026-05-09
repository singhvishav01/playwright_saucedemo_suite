# Playwright SauceDemo Test Suite
[![Playwright Tests](https://github.com/singhvishav01/playwright_saucedemo_suite/actions/workflows/playwright.yml/badge.svg)](https://github.com/singhvishav01/playwright_saucedemo_suite/actions/workflows/playwright.yml)

End-to-end test automation suite for [SauceDemo](https://www.saucedemo.com), built with Playwright and TypeScript. Structured using the Page Object Model pattern to demonstrate maintainable, scalable QA engineering practices.

## Tech Stack

- **[Playwright](https://playwright.dev/)** — cross-browser automation (Chromium, Firefox, WebKit)
- **TypeScript** — typed test code with compile-time safety
- **Node.js 22**

## Project Structure

```
├── fixtures/
│   └── users.ts              # Typed SauceDemo test credentials
├── pages/
│   ├── LoginPage.ts          # Login page interactions
│   ├── InventoryPage.ts      # Product listing page
│   ├── CartPage.ts           # Shopping cart page
│   └── CheckoutPage.ts       # Checkout flow (steps 1 & 2)
├── tests/
│   ├── auth.spec.ts          # Authentication tests (5)
│   ├── inventory.spec.ts     # Inventory & sorting tests (3)
│   ├── cart.spec.ts          # Cart management tests (4)
│   └── checkout.spec.ts      # Checkout flow tests (5)
├── playwright.config.ts      # Local config (Chromium + WebKit)
└── playwright.ci.config.ts   # CI config (all 3 browsers)
```

## Test Coverage

| Area | Tests | What's covered |
|---|---|---|
| Authentication | 5 | Successful login, locked-out user, wrong password, empty field validation |
| Inventory | 3 | Product count, cart badge increment, price sort correctness |
| Cart | 4 | Add item, multiple items, remove item, continue shopping |
| Checkout | 5 | Full order completion, first/last name and postal code validation, step navigation |
| **Total** | **17** | |

## Running the Tests

```bash
# Install dependencies
npm install

# Run all tests (Chromium + WebKit locally)
npx playwright test

# Run a specific browser
npx playwright test --project=chromium

# Run a specific test file
npx playwright test tests/auth.spec.ts

# Run in headed mode (watch the browser)
npx playwright test --headed

# Open the HTML report after a run
npx playwright show-report
```

## CI / GitHub Actions

Tests run automatically on every push and pull request via GitHub Actions. CI runs all three browsers (Chromium, Firefox, WebKit) on Ubuntu, where Playwright's full browser suite is supported without additional system configuration.

> **Local Firefox note:** Playwright's bundled Firefox requires the Microsoft Visual C++ 2015–2022 Redistributable on Windows. Install it via `winget install Microsoft.VCRedist.2015+.x64`, then restart your machine.

The HTML report is uploaded as a build artifact and retained for 30 days — accessible from the Actions tab on GitHub.

## Design Decisions

**Page Object Model** — Selectors and user actions are encapsulated in page classes. Tests call methods (`loginPage.login()`), never raw locators. When the UI changes, only the relevant page class needs updating — not every test that touches that page.

**Separate fixtures file** — Test credentials live in `fixtures/users.ts`, not scattered across spec files. One place to update if credentials change; typed with `as const satisfies` for compile-time shape checking.

**Two config files** — `playwright.config.ts` is the local development config. `playwright.ci.config.ts` is used by CI and enables Firefox, sets `workers: 1`, and hardcodes `retries: 2`. Keeping them separate means local runs are fast and CI runs are thorough.

**`toContain` over `toEqual` for error messages** — Error message assertions use `toContain` to target the meaningful substring rather than the exact string. This makes tests resilient to minor phrasing changes in the UI.

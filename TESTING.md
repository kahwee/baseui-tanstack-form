# Testing Guide

This project uses **Vitest** with **React Testing Library** for testing React components. Vitest is a modern, fast testing framework that integrates seamlessly with Vite.

## Table of Contents

- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Testing Form Components](#testing-form-components)
- [Storybook Integration](#storybook-integration)
- [Coverage](#coverage)

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Running Tests

### Available Commands

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (auto-reruns on file changes)
- `npm run test:ui` - Open Vitest UI in browser for interactive testing
- `npm run test:coverage` - Run tests and generate coverage report

### Test File Patterns

Vitest automatically finds test files matching these patterns:
- `**/*.test.{ts,tsx}`
- `**/*.spec.{ts,tsx}`
- `**/__tests__/**/*.{ts,tsx}`

## Writing Tests

### Basic Test Structure

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils/rtl';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Test Utilities

We provide a custom `render` function in `src/test-utils/rtl.tsx` that wraps components with necessary providers:

```tsx
import { render, screen } from '../test-utils/rtl';
```

This automatically wraps your components with:
- `StyletronProvider` - For BaseUI styling
- `BaseProvider` - For BaseUI theme

### User Interactions

Use `@testing-library/user-event` for simulating user interactions:

```tsx
import userEvent from '@testing-library/user-event';

it('handles user input', async () => {
  render(<MyForm />);

  const input = screen.getByLabelText('Email');
  await userEvent.type(input, 'test@example.com');

  expect(input).toHaveValue('test@example.com');
});
```

## Best Practices

### 1. Query Priority

Follow this priority when selecting elements:

1. **By Role** (Best) - `getByRole('button', { name: /submit/i })`
2. **By Label** - `getByLabelText('Email')`
3. **By Placeholder** - `getByPlaceholderText('Enter email')`
4. **By Text** - `getByText('Submit')`
5. **By Display Value** - `getByDisplayValue('John Doe')`
6. **By Test ID** (Last Resort) - `getByTestId('submit-button')`

### 2. Test User Behavior, Not Implementation

✅ **Good** - Test what users see and do
```tsx
it('submits the form when user clicks submit', async () => {
  render(<MyForm />);

  const nameInput = screen.getByLabelText('Name');
  await userEvent.type(nameInput, 'John Doe');

  const submitButton = screen.getByRole('button', { name: /submit/i });
  await userEvent.click(submitButton);

  expect(screen.getByText('Form submitted')).toBeInTheDocument();
});
```

❌ **Bad** - Test implementation details
```tsx
it('calls handleSubmit when form is submitted', () => {
  const handleSubmit = vi.fn();
  render(<MyForm onSubmit={handleSubmit} />);
  // Testing implementation detail
});
```

### 3. Use `screen` for Queries

Always use `screen` from `@testing-library/react` for queries:

```tsx
// Good
const button = screen.getByRole('button');

// Avoid
const { getByRole } = render(<MyComponent />);
const button = getByRole('button');
```

### 4. Async Testing

For components with async behavior, use `findBy` queries or `waitFor`:

```tsx
// findBy queries wait for elements to appear
it('displays error message', async () => {
  render(<MyForm />);

  const submitButton = screen.getByRole('button');
  await userEvent.click(submitButton);

  // Wait for error message to appear
  const error = await screen.findByText('Email is required');
  expect(error).toBeInTheDocument();
});

// Or use waitFor for more complex scenarios
import { waitFor } from '@testing-library/react';

it('loads data', async () => {
  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### 5. Accessible Testing

Test for accessibility by using role-based queries:

```tsx
it('is accessible', () => {
  render(<MyForm />);

  // These queries ensure elements are accessible
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
});
```

## Testing Form Components

### Basic Form Test

```tsx
import { useAppForm } from '../hooks/form';

it('renders form with input field', () => {
  function TestForm() {
    const form = useAppForm({
      defaultValues: { name: '' },
    });

    return (
      <form>
        <form.AppField name="name">
          {(field) => <field.Input label="Name" />}
        </form.AppField>
      </form>
    );
  }

  render(<TestForm />);
  expect(screen.getByLabelText('Name')).toBeInTheDocument();
});
```

### Testing Form Submission

```tsx
it('handles form submission', async () => {
  let submittedData = null;

  function TestForm() {
    const form = useAppForm({
      defaultValues: { email: '' },
      onSubmit: (values) => {
        submittedData = values;
      },
    });

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
        <form.AppField name="email">
          {(field) => <field.Input label="Email" />}
        </form.AppField>
        <button type="submit">Submit</button>
      </form>
    );
  }

  render(<TestForm />);

  const emailInput = screen.getByLabelText('Email');
  await userEvent.type(emailInput, 'test@example.com');

  const submitButton = screen.getByRole('button', { name: /submit/i });
  await userEvent.click(submitButton);

  expect(submittedData).toEqual({ email: 'test@example.com' });
});
```

### Testing Validation

```tsx
it('displays validation errors', async () => {
  function TestForm() {
    const form = useAppForm({
      defaultValues: { email: '' },
      validators: {
        onChange: ({ value }) => {
          if (!value.email) {
            return { email: 'Email is required' };
          }
        },
      },
    });

    return (
      <form>
        <form.AppField name="email">
          {(field) => <field.Input label="Email" />}
        </form.AppField>
      </form>
    );
  }

  render(<TestForm />);

  const emailInput = screen.getByLabelText('Email');

  // Trigger validation by focusing and blurring
  emailInput.focus();
  emailInput.blur();

  // Check for error message
  expect(await screen.findByText('Email is required')).toBeInTheDocument();
});
```

### Testing Placeholder

```tsx
it('displays placeholder text', () => {
  function TestForm() {
    const form = useAppForm({
      defaultValues: { email: '' },
    });

    return (
      <form>
        <form.AppField name="email">
          {(field) => (
            <field.Input
              label="Email"
              placeholder="your.email@example.com"
            />
          )}
        </form.AppField>
      </form>
    );
  }

  render(<TestForm />);

  const input = screen.getByPlaceholderText('your.email@example.com');
  expect(input).toBeInTheDocument();
});
```

## Storybook Integration

### Testing Stories

You can test your Storybook stories directly using the portable stories feature:

```tsx
import { describe, it, expect } from 'vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '../test-utils/rtl';
import * as stories from './my-component.stories';

// Compose all stories
const { Default, WithError } = composeStories(stories);

describe('MyComponent Stories', () => {
  it('renders Default story', () => {
    render(<Default />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders WithError story', () => {
    render(<WithError />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });
});
```

### Benefits of Testing Stories

1. **Single Source of Truth** - Your stories serve as both documentation and test cases
2. **Visual + Functional Testing** - Combine Storybook's visual testing with unit tests
3. **Reusability** - Share component setups between Storybook and tests

## Coverage

### Viewing Coverage

Run tests with coverage:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage` directory:
- `coverage/index.html` - HTML report (open in browser)
- `coverage/coverage-final.json` - JSON report
- Terminal output shows coverage summary

### Coverage Goals

Aim for:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### What to Test

✅ **Focus on:**
- User interactions (clicks, typing, form submissions)
- Conditional rendering
- Error states
- Form validation
- Accessibility

❌ **Don't test:**
- Third-party libraries (they have their own tests)
- Implementation details
- Styling (use visual regression testing instead)

## Browser Testing

This project uses Vitest's browser mode with Playwright for testing in a real browser environment.

### Benefits

1. **Real Browser Environment** - Tests run in actual Chromium browser
2. **Accurate Rendering** - Matches production environment
3. **Better Debugging** - Can see actual browser interactions

### Configuration

Browser mode is configured in `vitest.config.ts`:

```ts
test: {
  browser: {
    enabled: true,
    name: 'chromium',
    provider: 'playwright',
    headless: true,
  },
}
```

## Debugging Tests

### VS Code

Add breakpoints and run tests in debug mode:

1. Add `debugger` statement in your test
2. Run `npm run test:watch`
3. Tests will pause at debugger statements

### Vitest UI

Use the Vitest UI for interactive debugging:

```bash
npm run test:ui
```

This opens a browser interface where you can:
- Run individual tests
- View test results
- See code coverage
- Debug test failures

### Console Logging

```tsx
import { screen, debug } from '@testing-library/react';

it('debugs component', () => {
  render(<MyComponent />);

  // Print the entire DOM
  screen.debug();

  // Print a specific element
  const button = screen.getByRole('button');
  screen.debug(button);
});
```

## Common Patterns

### Testing Checkboxes

```tsx
it('toggles checkbox', async () => {
  function TestForm() {
    const form = useAppForm({
      defaultValues: { agreed: false },
    });

    return (
      <form>
        <form.AppField name="agreed">
          {(field) => <field.Checkbox label="I agree" />}
        </form.AppField>
      </form>
    );
  }

  render(<TestForm />);

  const checkbox = screen.getByLabelText('I agree');
  expect(checkbox).not.toBeChecked();

  await userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
});
```

### Testing Radio Groups

```tsx
it('selects radio option', async () => {
  function TestForm() {
    const form = useAppForm({
      defaultValues: { choice: '' },
    });

    return (
      <form>
        <form.AppField name="choice">
          {(field) => (
            <field.RadioGroup
              label="Choose"
              options={[
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B' },
              ]}
            />
          )}
        </form.AppField>
      </form>
    );
  }

  render(<TestForm />);

  const optionA = screen.getByLabelText('Option A');
  await userEvent.click(optionA);

  expect(optionA).toBeChecked();
});
```

### Testing Select Components

```tsx
it('renders select with options', () => {
  function TestForm() {
    const form = useAppForm({
      defaultValues: { category: '' },
    });

    return (
      <form>
        <form.AppField name="category">
          {(field) => (
            <field.SelectSingle
              label="Category"
              placeholder="Select a category"
              options={[
                { id: 'tech', label: 'Technology' },
                { id: 'design', label: 'Design' },
              ]}
            />
          )}
        </form.AppField>
      </form>
    );
  }

  render(<TestForm />);

  expect(screen.getByText('Category')).toBeInTheDocument();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Storybook Vitest Addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)

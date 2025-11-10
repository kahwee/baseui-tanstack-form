# BaseUI TanStack Form - Developer Guide

This guide is designed for AI assistants and developers working on this project. It provides comprehensive information about the tech stack, patterns, conventions, and best practices.

## 📦 Tech Stack

### Core Dependencies
- **React**: v18.3+ - UI library
- **TypeScript**: v5.9+ (strict mode enabled)
- **BaseUI**: v15.0+ - Uber's design system
- **Styletron**: v6.1+ - CSS-in-JS styling engine
- **TanStack Form**: v1.23+ - Headless form state management
- **Zod**: v4.1.12+ - TypeScript-first schema validation

### Build & Development Tools
- **Build Tool**: Vite v6.4+ (ESM-first bundler)
- **Testing**: Vitest v4.0+ with React Testing Library v14.3+ (jsdom environment)
- **Documentation**: Storybook v10.0+ (ESM-only)
- **Linting**: ESLint v9.39+ with TypeScript support
- **Formatting**: Prettier v3.6+
- **Git Hooks**: Husky v9.1+

## 🛠️ Available Commands

| Command | Description | Tool |
|---------|-------------|------|
| `npm run dev` | Start development server | Vite |
| `npm run build` | Build library for production | Vite + TypeScript |
| `npm run clean` | Remove dist and coverage directories | bash |
| `npm run lint` | Run ESLint checks | ESLint v9 |
| `npm run lint:fix` | Auto-fix ESLint errors | ESLint v9 |
| `npm run typecheck` | Run TypeScript type checking | TypeScript |
| `npm test` | Run all tests once | Vitest |
| `npm run test:watch` | Run tests in watch mode (auto-rerun) | Vitest |
| `npm run test:ui` | Open Vitest interactive UI in browser | Vitest |
| `npm run test:coverage` | Generate test coverage report | Vitest |
| `npm run storybook` | Start Storybook dev server (port 6006) | Storybook v10 |
| `npm run build:storybook` | Build Storybook for production | Storybook v10 |

## 📁 Project Structure

```
baseui-tanstack-form/
├── src/
│   ├── components/          # Shared/reusable components
│   ├── features/            # Feature-specific components
│   │   ├── input/          # Input field component
│   │   ├── textarea/       # Textarea component
│   │   ├── select/         # Select components (single/multi)
│   │   ├── checkbox/       # Checkbox components
│   │   ├── radio/          # Radio group component
│   │   └── ...             # Other form components
│   ├── hooks/              # Custom hooks
│   │   └── form.ts         # useAppForm, withForm HOC
│   ├── stories/            # Storybook stories
│   │   └── *.stories.tsx   # Component stories
│   ├── test-utils/         # Testing utilities
│   │   └── rtl.tsx         # React Testing Library setup
│   └── index.tsx           # Main export file
├── .storybook/             # Storybook configuration
│   ├── main.ts             # Storybook setup
│   └── preview.tsx         # Global decorators/parameters
├── dist/                   # Build output (git ignored)
├── coverage/               # Test coverage reports (git ignored)
├── vitest.config.ts        # Vitest configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint v9 flat config
└── package.json            # Dependencies and scripts
```

## 🎨 Naming Conventions

### Files
- **Components**: `lowercase-with-dashes.tsx` (e.g., `input-field.tsx`)
- **Utilities**: `lowercase-with-dashes.ts` (e.g., `form-helpers.ts`)
- **Tests**: `*.test.ts` or `*.test.tsx` (e.g., `input-field.test.tsx`)
- **Stories**: `*.stories.tsx` (e.g., `input-field.stories.tsx`)

### Code
- **Components**: `PascalCase` (e.g., `InputField`, `RadioGroup`)
- **Interfaces/Types**: `PascalCase` (e.g., `InputFieldProps`, `FormValues`)
- **Hooks**: `camelCase` with "use" prefix (e.g., `useAppForm`, `useFormValidation`)
- **Event Handlers**: `camelCase` with "handle" prefix (e.g., `handleChange`, `handleSubmit`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_LENGTH`, `DEFAULT_OPTIONS`)

## 🔧 Form Patterns

### Core Concepts

This library bridges TanStack Form with BaseUI components using a context-based pattern:

1. **Form Hook**: `useAppForm` - Creates a form instance with integrated components
2. **Field Context**: `form.AppField` - Provides field-level state and methods
3. **Component Access**: `field.ComponentName` - Access pre-configured BaseUI components
4. **Submission**: `form.handleSubmit()` - Handles form submission with validation

### Basic Form Pattern

```tsx
import { useAppForm } from './hooks/form';

function MyForm() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: ''
    },
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}>
      <form.AppField name="name">
        {(field) => (
          <field.Input
            label="Name"
            placeholder="Enter your name"
          />
        )}
      </form.AppField>

      <form.AppField name="email">
        {(field) => (
          <field.Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
          />
        )}
      </form.AppField>

      <form.AppForm>
        <form.SubscribeButton label="Submit" />
      </form.AppForm>
    </form>
  );
}
```

### Form Composition with HOC

Use `withForm` to create reusable form sections:

```tsx
import { useAppForm, withForm } from './hooks/form';

// Reusable address section
const AddressForm = withForm({
  defaultValues: {
    street: '',
    city: '',
    zipCode: ''
  },
  props: { title: 'Address' },
  render: function({ form, title }) {
    return (
      <Card>
        <StyledBody>
          <HeadingSmall>{title}</HeadingSmall>
          <form.AppField name="street">
            {(field) => <field.Input label="Street" placeholder="123 Main St" />}
          </form.AppField>
          <form.AppField name="city">
            {(field) => <field.Input label="City" placeholder="San Francisco" />}
          </form.AppField>
          <form.AppField name="zipCode">
            {(field) => <field.Input label="ZIP Code" placeholder="94102" />}
          </form.AppField>
        </StyledBody>
      </Card>
    );
  }
});

// Parent form using the reusable section
function CheckoutForm() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      street: '',
      city: '',
      zipCode: ''
    },
    onSubmit: (values) => console.log(values)
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      <form.AppField name="name">
        {(field) => <field.Input label="Name" />}
      </form.AppField>

      <form.AppField name="email">
        {(field) => <field.Input label="Email" type="email" />}
      </form.AppField>

      {/* Reusable address form */}
      <AddressForm form={form} title="Shipping Address" />

      <form.AppForm>
        <form.SubscribeButton label="Place Order" />
      </form.AppForm>
    </form>
  );
}
```

## 🧩 Available Components

### Text Input Components

All text input components support the `placeholder` prop for user guidance:

#### Input
Basic text input field with validation support.

```tsx
<form.AppField name="username">
  {(field) => (
    <field.Input
      label="Username"
      placeholder="Enter username"
      type="text"  // text, email, password, etc.
    />
  )}
</form.AppField>
```

**Props**: `label`, `placeholder`, `type`, `error`, `caption`

#### Textarea
Multi-line text input for longer content.

```tsx
<form.AppField name="bio">
  {(field) => (
    <field.Textarea
      label="Biography"
      placeholder="Tell us about yourself..."
      rows={4}
    />
  )}
</form.AppField>
```

**Props**: `label`, `placeholder`, `rows`, `error`, `caption`

### Selection Components

#### RadioGroup
Radio button group for single selection.

```tsx
<form.AppField name="size">
  {(field) => (
    <field.RadioGroup
      label="Size"
      options={[
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ]}
    />
  )}
</form.AppField>
```

**Value Type**: `string`

#### SelectSingle
Dropdown select for single option selection.

```tsx
<form.AppField name="country">
  {(field) => (
    <field.SelectSingle
      label="Country"
      placeholder="Select a country"
      options={[
        { id: 'us', label: 'United States' },
        { id: 'uk', label: 'United Kingdom' },
        { id: 'ca', label: 'Canada' }
      ]}
    />
  )}
</form.AppField>
```

**Value Type**: `string`
**Props**: `label`, `placeholder`, `options`

#### SelectMulti
Dropdown select for multiple option selection.

```tsx
<form.AppField name="skills">
  {(field) => (
    <field.SelectMulti
      label="Skills"
      placeholder="Select your skills"
      options={[
        { id: 'react', label: 'React' },
        { id: 'typescript', label: 'TypeScript' },
        { id: 'nodejs', label: 'Node.js' },
        { id: 'graphql', label: 'GraphQL' }
      ]}
    />
  )}
</form.AppField>
```

**Value Type**: `string[]`
**Props**: `label`, `placeholder`, `options`

### Boolean Components

#### Checkbox
Single checkbox for boolean values.

```tsx
<form.AppField name="agreeToTerms">
  {(field) => (
    <field.Checkbox
      label="I agree to the terms and conditions"
    />
  )}
</form.AppField>
```

**Value Type**: `boolean`

#### CheckboxGroup
Multiple checkboxes returning an array of selected values.

```tsx
<form.AppField name="interests">
  {(field) => (
    <field.CheckboxGroup
      label="Select your interests"
      inline={true}  // Display horizontally
      options={[
        { value: 'technology', label: 'Technology' },
        { value: 'science', label: 'Science' },
        { value: 'art', label: 'Art' },
        { value: 'music', label: 'Music' }
      ]}
    />
  )}
</form.AppField>
```

**Value Type**: `string[]`
**Props**: `label`, `options`, `inline`

#### Toggle
Toggle switch for boolean values.

```tsx
<form.AppField name="notifications">
  {(field) => (
    <field.Toggle>
      Enable email notifications
    </field.Toggle>
  )}
</form.AppField>
```

**Value Type**: `boolean`

### Date Components

#### DatePicker
Date selection with optional range picking.

```tsx
<form.AppField name="birthDate">
  {(field) => (
    <field.DatePicker
      label="Birth Date"
      // Optional: enable range selection
      // range
      // Optional: set min/max dates
      // minDate={new Date(1900, 0, 1)}
      // maxDate={new Date()}
    />
  )}
</form.AppField>
```

**Value Type**: `Date` or `string`

### Form Controls

#### SubscribeButton
Submit button with loading state management.

```tsx
<form.AppForm>
  <form.SubscribeButton label="Submit" />
</form.AppForm>
```

The button automatically shows loading state during form submission.

## ✅ Validation

### Manual Field Validation

For simple validation logic, validate directly in the field render function:

```tsx
<form.AppField name="username">
  {(field) => {
    // Manual validation logic
    const error = field.state.value.length < 3
      ? 'Username must be at least 3 characters'
      : undefined;

    return (
      <field.Input
        label="Username"
        placeholder="Enter username"
        error={!!error}
        caption={error}
      />
    );
  }}
</form.AppField>
```

### Zod v4 Schema Validation

Zod provides powerful, type-safe validation with excellent TypeScript integration.

#### Basic Schema Examples

```tsx
import { z } from 'zod';

const userSchema = z.object({
  // String validation with trim
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters'),

  // Email validation
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),

  // URL validation
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional(),

  // Number validation
  age: z
    .number()
    .int('Age must be a whole number')
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Please enter a valid age'),

  // Enum validation
  role: z.enum(['admin', 'user', 'moderator'], {
    message: 'Please select a valid role'
  }),

  // Array validation
  tags: z
    .array(z.string())
    .min(1, 'Select at least one tag')
    .max(10, 'Maximum 10 tags allowed'),

  // Boolean validation (checkbox must be checked)
  agreeToTerms: z.literal(true, {
    message: 'You must agree to the terms and conditions'
  }),

  // Optional field with default
  bio: z
    .string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional()
    .default('')
});

// Infer TypeScript type from schema
type UserFormValues = z.infer<typeof userSchema>;
```

#### Form Integration

```tsx
const form = useAppForm<UserFormValues>({
  defaultValues: {
    username: '',
    email: '',
    website: '',
    age: 18,
    role: 'user',
    tags: [],
    agreeToTerms: false,
    bio: ''
  },
  validators: {
    // Real-time validation on field change
    onChange: ({ value }) => {
      const result = userSchema.safeParse(value);
      if (!result.success) {
        return result.error.format();
      }
      return undefined;
    },
    // Validation on field blur
    onBlur: ({ value }) => {
      const result = userSchema.safeParse(value);
      if (!result.success) {
        return result.error.format();
      }
      return undefined;
    }
  },
  onSubmit: async (values) => {
    const result = userSchema.safeParse(values);
    if (!result.success) {
      console.error('Validation errors:', result.error.format());
      return;
    }
    console.log('Form submitted with valid data:', result.data);
  }
});
```

#### Advanced Zod Features

**1. Transform - Data transformation on validation**

```tsx
const nameSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim()
}).transform((data) => ({
  ...data,
  fullName: `${data.firstName} ${data.lastName}`,
  initials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase()
}));

// Result includes transformed fields
const result = nameSchema.safeParse({ firstName: 'John', lastName: 'Doe' });
// result.data = {
//   firstName: 'John',
//   lastName: 'Doe',
//   fullName: 'John Doe',
//   initials: 'JD'
// }
```

**2. Refine - Custom cross-field validation**

```tsx
const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']  // Error appears on confirmPassword field
  }
);
```

**3. Regex validation**

```tsx
const usernameSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Only letters, numbers, and underscores allowed'
    ),

  phoneNumber: z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone must be in format: 123-456-7890')
});
```

**4. Nested object validation**

```tsx
const profileSchema = z.object({
  name: z.string(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional()
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().length(2, 'State must be 2 characters'),
    zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code')
  }).optional(),
  socialMedia: z.object({
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional()
  }).optional()
});
```

**5. Discriminated unions**

```tsx
const paymentSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('card'),
    cardNumber: z.string().regex(/^\d{16}$/, 'Card must be 16 digits'),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3-4 digits'),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY')
  }),
  z.object({
    method: z.literal('paypal'),
    email: z.string().email('Invalid PayPal email')
  }),
  z.object({
    method: z.literal('bank'),
    accountNumber: z.string(),
    routingNumber: z.string().regex(/^\d{9}$/, 'Routing must be 9 digits')
  })
]);
```

### Complete Validation Example

```tsx
import { useAppForm } from './hooks/form';
import { z } from 'zod';

const registrationSchema = z.object({
  username: z.string().trim().min(3).max(20),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  age: z.number().int().min(18),
  role: z.enum(['user', 'moderator']),
  tags: z.array(z.string()).min(1),
  agreeToTerms: z.literal(true)
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);

type RegistrationFormValues = z.infer<typeof registrationSchema>;

function RegistrationForm() {
  const form = useAppForm<RegistrationFormValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 18,
      role: 'user',
      tags: [],
      agreeToTerms: false
    },
    validators: {
      onChange: ({ value }) => {
        const result = registrationSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      }
    },
    onSubmit: async (values) => {
      const result = registrationSchema.safeParse(values);
      if (result.success) {
        console.log('Valid data:', result.data);
        // Submit to API
      }
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      <form.AppField name="username">
        {(field) => (
          <field.Input
            label="Username"
            placeholder="Enter your username"
          />
        )}
      </form.AppField>

      <form.AppField name="email">
        {(field) => (
          <field.Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
          />
        )}
      </form.AppField>

      <form.AppField name="password">
        {(field) => (
          <field.Input
            label="Password"
            type="password"
            placeholder="Enter a strong password"
          />
        )}
      </form.AppField>

      <form.AppField name="confirmPassword">
        {(field) => (
          <field.Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
          />
        )}
      </form.AppField>

      <form.AppField name="role">
        {(field) => (
          <field.RadioGroup
            label="Role"
            options={[
              { value: 'user', label: 'User' },
              { value: 'moderator', label: 'Moderator' }
            ]}
          />
        )}
      </form.AppField>

      <form.AppField name="tags">
        {(field) => (
          <field.SelectMulti
            label="Tags"
            placeholder="Select at least one tag"
            options={[
              { id: 'tech', label: 'Technology' },
              { id: 'design', label: 'Design' },
              { id: 'business', label: 'Business' }
            ]}
          />
        )}
      </form.AppField>

      <form.AppField name="agreeToTerms">
        {(field) => (
          <field.Checkbox
            label="I agree to the terms and conditions"
          />
        )}
      </form.AppField>

      <form.AppForm>
        <form.SubscribeButton label="Register" />
      </form.AppForm>
    </form>
  );
}
```

## 🧪 Testing

This project uses **Vitest v4** with **React Testing Library v14.3+** for comprehensive component testing.

### Quick Start

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-reruns on file changes)
npm run test:watch

# Open Vitest UI for interactive testing
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test File Locations

Tests should be placed in:
- `src/**/*.test.{ts,tsx}` - Test files alongside components
- `src/**/__tests__/**/*.{ts,tsx}` - Test files in `__tests__` directories

### Writing Tests

**Example test:**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../hooks/form';

describe('InputField', () => {
  it('handles user input correctly', async () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: { name: '' }
      });

      return (
        <form>
          <form.AppField name="name">
            {(field) => (
              <field.Input
                label="Name"
                placeholder="Enter your name"
              />
            )}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const input = screen.getByLabelText('Name');
    await userEvent.type(input, 'John Doe');

    expect(input).toHaveValue('John Doe');
  });

  it('displays validation errors', async () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: { username: '' }
      });

      return (
        <form>
          <form.AppField name="username">
            {(field) => {
              const error = field.state.value.length < 3
                ? 'Username must be at least 3 characters'
                : undefined;

              return (
                <field.Input
                  label="Username"
                  placeholder="Enter username"
                  error={!!error}
                  caption={error}
                />
              );
            }}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const input = screen.getByLabelText('Username');
    await userEvent.type(input, 'ab');

    expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Use Role-Based Queries** - Prefer `getByRole`, `getByLabelText` for better accessibility testing
2. **Test User Behavior** - Focus on what users see and do, not implementation details
3. **Async Testing** - Use `findBy` queries or `waitFor` for asynchronous behavior
4. **Custom Render** - Use `render` from `test-utils/rtl` for automatic provider setup
5. **User Interactions** - Use `@testing-library/user-event` for realistic user interactions

### Test Utilities

All tests have access to a custom `render` function that automatically wraps components with:
- `StyletronProvider` - For BaseUI styling support
- `BaseProvider` - For BaseUI theme support

```tsx
import { render, screen } from '../test-utils/rtl';
// Components are automatically wrapped with necessary providers
```

### Coverage Goals

- **Statements**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+

Coverage reports are generated in the `coverage/` directory:
- HTML report: `coverage/index.html` (open in browser)
- Terminal output shows summary

### More Information

See **[TESTING.md](./TESTING.md)** for comprehensive testing guidelines, patterns, and examples.

## 📚 Storybook

### Development

Start the Storybook development server:

```bash
npm run storybook
```

Visit [http://localhost:6006](http://localhost:6006) to view the component library.

### Writing Stories

Stories are located in `src/stories/*.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useAppForm } from '../hooks/form';

const meta: Meta = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

export const Basic: StoryObj = {
  render: () => {
    const form = useAppForm({
      defaultValues: { name: '' }
    });

    return (
      <form.AppField name="name">
        {(field) => (
          <field.Input
            label="Name"
            placeholder="Enter your name"
          />
        )}
      </form.AppField>
    );
  }
};
```

### Deployment to GitHub Pages

Storybook is automatically deployed to GitHub Pages on every push to the `main` branch.

**Setup:**
1. Go to **Settings** → **Pages** in your GitHub repository
2. Under "Build and deployment", select **Source**: "GitHub Actions"
3. Push to main branch to trigger deployment

**Access deployed Storybook:**
https://kahwee.github.io/baseui-tanstack-form/

## 🔧 Development Workflow

### Pre-commit Hooks

Husky runs the following checks before each commit:
- ESLint checks (`npm run lint`)
- TypeScript type checking (`npm run typecheck`)

If checks fail, the commit will be blocked. Fix the issues or use `--no-verify` to bypass (not recommended).

### Code Quality Checklist

Before submitting a PR:
- ✅ All tests pass: `npm test`
- ✅ No linting errors: `npm run lint`
- ✅ No type errors: `npm run typecheck`
- ✅ Code is formatted: Prettier runs automatically
- ✅ Tests have good coverage: `npm run test:coverage`
- ✅ Storybook builds: `npm run build:storybook`
- ✅ Library builds: `npm run build`

### Export Guidelines

All public components, hooks, and utilities must be exported through the main `index.tsx` file:

```tsx
// src/index.tsx
export { useAppForm, withForm } from './hooks/form';
export type { FormOptions, FieldProps } from './types';
// ... other exports
```

## 📖 Additional Resources

- **[README.md](./README.md)** - User-facing documentation
- **[TESTING.md](./TESTING.md)** - Comprehensive testing guide
- **[FORM_COMPOSITION.md](./FORM_COMPOSITION.md)** - Advanced form composition patterns
- **[Storybook](https://kahwee.github.io/baseui-tanstack-form/)** - Live component examples

## 🎯 Key Principles

1. **Type Safety First** - Leverage TypeScript for better DX and fewer bugs
2. **Accessibility** - All components should be WCAG compliant
3. **Composition** - Build complex forms from simple, reusable pieces
4. **Testing** - Write tests for all new features and bug fixes
5. **Documentation** - Keep docs up-to-date with code changes
6. **Performance** - Optimize for bundle size and runtime performance
7. **Developer Experience** - Make the API intuitive and well-documented

# BaseUI TanStack Form

## Tech Stack
- **React**: v18.2+
- **TypeScript**: v5.3+ (strict mode)
- **ESLint**: v9.22+
- **Prettier**: v3.2+
- **Vite**: v5.1+
- **Testing**: Vitest v4.0+ with React Testing Library v14.3+ (jsdom environment)
- **Storybook**: v10.0+ (ESM-only)
- **Forms**: TanStack Form v1.1.0+
- **Validation**: Zod v4.1.12+ (upgraded from v3)
- **UI Components**: BaseUI v15+
- **Styling**: Styletron

## Commands
- Development: `npm run dev` (Vite)
- Build: `npm run build` (Vite + TypeScript)
- Clean: `npm run clean` (removes dist and coverage directories)
- Lint: `npm run lint` (ESLint v9)
- Type check: `npm run typecheck` (TypeScript)
- Test: `npm run test` (Vitest - runs all tests once)
- Test watch mode: `npm run test:watch` (Vitest in watch mode with auto-rerun)
- Test UI: `npm run test:ui` (Vitest interactive UI in browser)
- Test coverage: `npm run test:coverage` (Vitest with coverage report)
- Storybook: `npm run storybook`
- Build Storybook: `npm run build:storybook`

## Naming Conventions
- Files: `lowercase-with-dashes.tsx` for components, `.ts` for utilities
- Components: PascalCase (e.g., `InputField`)
- Interfaces: PascalCase (e.g., `InputFieldProps`)
- Hooks: camelCase with "use" prefix (e.g., `useAppForm`) 
- Event handlers: camelCase with "handle" prefix (e.g., `handleChange`)

## Form Patterns
- Use `useAppForm` hook to create form instances
- Use `withForm` HOC for composable form sections
- Use `formOptions` for shared form configuration
- Field values are accessed via field context

### Components
- `Input` - BaseUI input field with form integration (supports `placeholder` prop)
- `Textarea` - BaseUI textarea with form integration (supports `placeholder` prop)
- `RadioGroup` - BaseUI radio group with form integration
- `Select` - BaseUI select (dropdown) with single and multi-select support (supports `placeholder` prop)
- `Checkbox` - BaseUI checkbox for boolean values
- `CheckboxGroup` - Multiple checkboxes that return an array of selected values
- `DatePicker` - Date selection with optional range picking
- `SubscribeButton` - Submit button with loading state
- Field access with `form.AppField` pattern and `field.ComponentName` usage
- Form submission with `form.handleSubmit()`

### Placeholder Support
All text input components (`Input`, `Textarea`, `SelectSingle`, `SelectMulti`) support the `placeholder` prop for providing helpful hints to users:

```tsx
<form.AppField name="email">
  {(field) => (
    <field.Input
      label="Email Address"
      placeholder="your.email@example.com"
    />
  )}
</form.AppField>

<form.AppField name="bio">
  {(field) => (
    <field.Textarea
      label="Biography"
      placeholder="Tell us about yourself..."
    />
  )}
</form.AppField>

<form.AppField name="category">
  {(field) => (
    <field.SelectSingle
      label="Category"
      placeholder="Select a category"
      options={[
        { id: 'tech', label: 'Technology' },
        { id: 'design', label: 'Design' }
      ]}
    />
  )}
</form.AppField>
```

### Example
```tsx
// Import the pre-configured form hook
import { useAppForm, withForm } from './hooks/form';

// Form section with withForm HOC
const GroupForm = withForm({
  defaultValues: { firstName: 'John', lastName: 'Doe' },
  props: { title: 'Child Form' },
  render: function({ form, title }) {
    return (
      <Card>
        <StyledBody>
          <HeadingSmall>{title}</HeadingSmall>
          <form.AppField name="firstName">
            {(field) => <field.Input label="First Name" />}
          </form.AppField>
          <form.AppField name="comments">
            {(field) => <field.Textarea label="Comments" />}
          </form.AppField>
        </StyledBody>
        <StyledAction>
          <form.AppForm>
            <form.SubscribeButton label="Submit" />
          </form.AppForm>
        </StyledAction>
      </Card>
    );
  },
});

// Main form
function ParentForm() {
  const form = useAppForm({
    defaultValues: { 
      firstName: 'John', 
      lastName: 'Doe',
      comments: '',
      preference: '',
      category: '',
      tags: [],
      agreeToTerms: false,
      interests: []
    },
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}>
      <GroupForm form={form} title="Person Information" />
      
      <form.AppField name="preference">
        {(field) => (
          <field.RadioGroup
            label="Preference"
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]}
          />
        )}
      </form.AppField>
      
      <form.AppField name="category">
        {(field) => (
          <field.SelectSingle
            label="Category"
            options={[
              { id: 'electronics', label: 'Electronics' },
              { id: 'books', label: 'Books' },
              { id: 'clothing', label: 'Clothing' }
            ]}
            placeholder="Select a category"
          />
        )}
      </form.AppField>
      
      <form.AppField name="tags">
        {(field) => (
          <field.SelectMulti
            label="Tags"
            options={[
              { id: 'new', label: 'New' },
              { id: 'sale', label: 'Sale' },
              { id: 'featured', label: 'Featured' },
              { id: 'limited', label: 'Limited Edition' }
            ]}
            placeholder="Select tags"
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
      
      <form.AppField name="interests">
        {(field) => (
          <field.CheckboxGroup
            label="Select your interests"
            inline={true}
            options={[
              { value: 'technology', label: 'Technology' },
              { value: 'science', label: 'Science' },
              { value: 'art', label: 'Art' },
              { value: 'music', label: 'Music' }
            ]}
          />
        )}
      </form.AppField>
    </form>
  );
}
```

## Validation

### Manual Field Validation
```tsx
<form.AppField name="username">
  {(field) => {
    // Manual validation logic
    const error = field.state.value.length < 3
      ? 'Username must be at least 3 characters'
      : undefined;

    return <field.Input
      label="Username"
      placeholder="Enter username"
      error={!!error}
      caption={error}
    />;
  }}
</form.AppField>
```

### Zod v4 Schema Validation

Zod v4 provides powerful, type-safe validation with excellent TypeScript integration.

#### Basic Schema
```tsx
import { z } from 'zod';

const schema = z.object({
  // String validation with trim (removes whitespace)
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
    message: 'Please select a valid role',
  }),

  // Array validation
  tags: z
    .array(z.string())
    .min(1, 'Select at least one tag')
    .max(10, 'Maximum 10 tags allowed'),

  // Boolean validation (checkbox must be checked)
  agreeToTerms: z.literal(true, {
    message: 'You must agree to the terms and conditions',
  }),

  // Optional field with default
  bio: z
    .string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional()
    .default(''),
});

type FormValues = z.infer<typeof schema>;
```

#### Form Integration with Validators
```tsx
const form = useAppForm<FormValues>({
  defaultValues: {
    username: '',
    email: '',
    website: '',
    age: 18,
    role: 'user',
    tags: [],
    agreeToTerms: false,
    bio: '',
  },
  validators: {
    // Real-time validation on change
    onChange: ({ value }) => {
      const result = schema.safeParse(value);
      if (!result.success) {
        return result.error.format();
      }
      return undefined;
    },
    // Validation on blur
    onBlur: ({ value }) => {
      const result = schema.safeParse(value);
      if (!result.success) {
        return result.error.format();
      }
      return undefined;
    },
  },
  onSubmit: async (values) => {
    const result = schema.safeParse(values);
    if (!result.success) {
      console.error('Validation errors:', result.error.format());
      return;
    }
    console.log('Form submitted with valid data:', result.data);
  },
});
```

#### Advanced Zod v4 Features

**1. Transform - Data transformation on validation**
```tsx
const transformSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
}).transform((data) => ({
  ...data,
  fullName: `${data.firstName} ${data.lastName}`,
  initials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
}));

// Usage
const result = transformSchema.safeParse({ firstName: 'John', lastName: 'Doe' });
// result.data = { firstName: 'John', lastName: 'Doe', fullName: 'John Doe', initials: 'JD' }
```

**2. Refine - Custom cross-field validation**
```tsx
const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Error appears on confirmPassword field
  }
);
```

**3. Regex validation**
```tsx
const usernameSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
});
```

**4. Nested object validation**
```tsx
const userSchema = z.object({
  name: z.string(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  socialMedia: z.object({
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
  }).optional(),
});
```

**5. Discriminated unions**
```tsx
const paymentSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('card'),
    cardNumber: z.string(),
    cvv: z.string(),
  }),
  z.object({
    method: z.literal('paypal'),
    email: z.string().email(),
  }),
  z.object({
    method: z.literal('bank'),
    accountNumber: z.string(),
    routingNumber: z.string(),
  }),
]);
```

### Complete Form Example with Zod v4
```tsx
import { useAppForm } from './hooks/form';
import { z } from 'zod';

const registrationSchema = z.object({
  username: z.string().trim().min(3).max(20),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
  age: z.number().int().min(18),
  role: z.enum(['user', 'moderator']),
  tags: z.array(z.string()).min(1),
  agreeToTerms: z.literal(true),
});

function RegistrationForm() {
  const form = useAppForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      age: 18,
      role: 'user',
      tags: [],
      agreeToTerms: false,
    },
    validators: {
      onChange: ({ value }) => {
        const result = registrationSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
    onSubmit: async (values) => {
      const result = registrationSchema.safeParse(values);
      if (result.success) {
        console.log('Valid data:', result.data);
      }
    },
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
            placeholder="your.email@example.com"
            type="email"
          />
        )}
      </form.AppField>

      <form.AppField name="password">
        {(field) => (
          <field.Input
            label="Password"
            placeholder="Enter a strong password"
            type="password"
          />
        )}
      </form.AppField>

      <form.AppField name="role">
        {(field) => (
          <field.RadioGroup
            label="Role"
            options={[
              { value: 'user', label: 'User' },
              { value: 'moderator', label: 'Moderator' },
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
              { id: 'business', label: 'Business' },
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

## Development
- Stories in `src/stories/*.stories.tsx`
- Components organized by feature in `src/features/*`
- Shared hooks in `src/hooks/*`
- Shared components in `src/components/*`
- Run lint and typecheck before commit (Husky pre-commit hook)
- Export components through the main `index.tsx` file

## Testing

This project uses **Vitest v4** with **React Testing Library** for comprehensive component testing.

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

### Writing Tests

Tests should be placed in:
- `src/**/*.test.{ts,tsx}` - Test files alongside components
- `src/**/__tests__/**/*.{ts,tsx}` - Test files in `__tests__` directories

**Example test:**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils/rtl';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../hooks/form';

describe('MyComponent', () => {
  it('handles user input', async () => {
    function TestForm() {
      const form = useAppForm({
        defaultValues: { name: '' },
      });

      return (
        <form>
          <form.AppField name="name">
            {(field) => <field.Input label="Name" placeholder="Enter your name" />}
          </form.AppField>
        </form>
      );
    }

    render(<TestForm />);

    const input = screen.getByLabelText('Name');
    await userEvent.type(input, 'John Doe');

    expect(input).toHaveValue('John Doe');
  });
});
```

### Testing Best Practices

1. **Use Role-Based Queries** - `getByRole`, `getByLabelText` for accessibility
2. **Test User Behavior** - Focus on what users see and do, not implementation details
3. **Async Testing** - Use `findBy` queries or `waitFor` for async behavior
4. **Custom Render** - Use `render` from `test-utils/rtl` for automatic providers
5. **User Interactions** - Use `@testing-library/user-event` for realistic interactions

### Test Utilities

All tests have access to a custom `render` function that automatically wraps components with:
- `StyletronProvider` - For BaseUI styling support
- `BaseProvider` - For BaseUI theme support

```tsx
import { render, screen } from '../test-utils/rtl';
// Components are automatically wrapped with providers
```

### Coverage

Coverage reports are generated in the `coverage/` directory:
- HTML report: `coverage/index.html` (open in browser)
- Terminal output shows summary

**Coverage goals:**
- Statements: 70%+
- Branches: 70%+
- Functions: 70%+
- Lines: 70%+

### More Information

See [TESTING.md](./TESTING.md) for comprehensive testing guidelines, patterns, and examples.

## Storybook Deployment to GitHub Pages

This project is configured to automatically deploy Storybook to GitHub Pages using GitHub Actions.

### Automatic Deployment

The workflow is defined in `.github/workflows/deploy-storybook.yml` and will:
- Trigger automatically on every push to the `main` branch
- Can also be manually triggered from the Actions tab
- Build Storybook using Storybook v10
- Deploy to GitHub Pages

### Setup Instructions

1. **Enable GitHub Pages in your repository:**
   - Go to **Settings** → **Pages**
   - Under "Build and deployment", select **Source**: "GitHub Actions"
   - Save the changes

2. **Push changes to main branch:**
   ```bash
   git push origin main
   ```

3. **Monitor deployment:**
   - Go to the **Actions** tab in your GitHub repository
   - Watch the "Deploy Storybook to GitHub Pages" workflow run
   - Once complete, your Storybook will be live

4. **Access your deployed Storybook:**
   - URL: `https://kahwee.github.io/baseui-tanstack-form/`
   - The URL will also be shown in the Actions workflow output

### Manual Deployment

To manually trigger a deployment:
1. Go to **Actions** tab
2. Select "Deploy Storybook to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

### Local Build Testing

To test the Storybook build locally before deploying:
```bash
npm run build:storybook
# Output will be in ./storybook-static directory
```

### Troubleshooting

- **404 errors**: Ensure GitHub Pages is configured to use "GitHub Actions" as the source
- **Build failures**: Check the Actions tab for error logs
- **Old version showing**: Clear browser cache (Ctrl+Shift+R)

### Summary

This pull request introduces updates to the ESLint configuration file (`eslint.config.js`) to ensure consistent code quality and adherence to best practices across the project. The changes include:

- Integration of TypeScript, React, and Prettier rules.
- Customization of rules for better developer experience and project-specific needs.
- Environment-specific configurations for Node.js, browser, and testing files.
- Ignoring unnecessary directories and files from linting.

### Changes

1. **TypeScript Rules**:
   - Added rules to warn against the use of `any` type.
   - Configured unused variable rules to ignore variables prefixed with `_`.
   - Allowed `@ts-expect-error` and `@ts-ignore` with descriptions.

2. **React Rules**:
   - Enforced `react/react-in-jsx-scope` to ensure React is in scope.
   - Disabled `react/prop-types` as TypeScript is used for type checking.
   - Warned against using `children` as a prop.

3. **Prettier Integration**:
   - Configured Prettier as an ESLint plugin to enforce formatting rules.
   - Added rules for consistent indentation, quotes, and console usage.

4. **Environment-Specific Configurations**:
   - Browser-specific rules allow browser globals.
   - Node.js-specific rules allow unrestricted use of `console`.
   - Testing environment includes Jest globals.

5. **Ignored Directories**:
   - Excluded `node_modules`, `dist`, `coverage`, `.storybook`, and `storybook-static` from linting.

### Testing

- Verified the ESLint configuration by running linting across the project.
- Ensured no unintended linting errors or warnings were introduced.

### Notes

- Developers should ensure their editors are configured to use the updated ESLint rules.
- Prettier integration requires the Prettier plugin to be installed in the editor for seamless formatting.
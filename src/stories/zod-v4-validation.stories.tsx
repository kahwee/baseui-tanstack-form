import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAppForm } from '../hooks/form';
import { Block } from 'baseui/block';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { HeadingSmall, ParagraphSmall } from 'baseui/typography';
import { z } from 'zod';

/**
 * Zod v4 Validation Examples
 *
 * This story demonstrates the advanced validation capabilities of Zod v4
 * integrated with TanStack Form and BaseUI components.
 */

// Advanced Zod v4 schema with all modern features
const zodV4Schema = z.object({
  // String validation with trim (auto-trims whitespace)
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),

  // Email validation
  email: z.string().email('Please enter a valid email address').toLowerCase(),

  // URL validation
  website: z
    .string()
    .url('Please enter a valid URL (e.g., https://example.com)')
    .optional()
    .or(z.literal('')),

  // Password with custom validation
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  // Number validation with coercion from string
  age: z.coerce
    .number({ message: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please enter a valid age'),

  // Enum validation with custom error message
  role: z.enum(['admin', 'user', 'moderator'], {
    message: 'Please select a valid role',
  }),

  // Array validation
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .min(2, 'Please select at least 2 tags')
    .max(5, 'You can select up to 5 tags'),

  // Boolean validation
  agreeToTerms: z.literal(true, {
    message: 'You must agree to the terms and conditions',
  }),

  // Optional fields with default values
  bio: z
    .string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional()
    .default(''),
});

const ZodV4ValidationForm = () => {
  const form = useAppForm({
    defaultValues: {
      username: '',
      email: '',
      website: '',
      password: '',
      age: '18',
      role: 'user' as 'admin' | 'user' | 'moderator',
      tags: [] as string[],
      agreeToTerms: false,
      bio: '',
    },
    validators: {
      onChange: ({ value }) => {
        const result = zodV4Schema.safeParse(value);
        if (!result.success) {
          return result.error.format();
        }
        return undefined;
      },
    },
    onSubmit: async (values) => {
      // Validate on submit
      const result = zodV4Schema.safeParse(values);
      if (!result.success) {
        console.error('Validation errors:', result.error.format());
        alert('Please fix the validation errors');
      } else {
        console.info('Form submitted successfully:', result.data);
        alert('Form submitted successfully! Check console for values.');
      }
    },
  });

  return (
    <Block padding="24px" width="100%" maxWidth="600px" margin="0 auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card>
          <StyledBody>
            <HeadingSmall marginBottom="8px">
              Zod v4 Advanced Validation
            </HeadingSmall>
            <ParagraphSmall marginBottom="24px" color="contentSecondary">
              All fields are validated using Zod v4 with real-time feedback
            </ParagraphSmall>

            {/* Username field with trim and regex validation */}
            <form.AppField name="username">
              {(field) => (
                <field.Input
                  label="Username"
                  placeholder="Enter your username (letters, numbers, underscore)"
                  formControlProps={{
                    caption:
                      '3-20 characters, alphanumeric and underscore only',
                  }}
                />
              )}
            </form.AppField>

            {/* Email field with email validation */}
            <form.AppField name="email">
              {(field) => (
                <field.Input
                  label="Email Address"
                  placeholder="your.email@example.com"
                  type="email"
                />
              )}
            </form.AppField>

            {/* Website field with URL validation */}
            <form.AppField name="website">
              {(field) => (
                <field.Input
                  label="Website (Optional)"
                  placeholder="https://yourwebsite.com"
                  type="url"
                />
              )}
            </form.AppField>

            {/* Password field with complex validation */}
            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label="Password"
                  placeholder="Enter a strong password"
                  type="password"
                  formControlProps={{
                    caption:
                      'Min 8 chars with uppercase, lowercase, and number',
                  }}
                />
              )}
            </form.AppField>

            {/* Age field with number validation */}
            <form.AppField name="age">
              {(field) => (
                <field.Input
                  label="Age"
                  placeholder="Enter your age"
                  type="number"
                />
              )}
            </form.AppField>

            {/* Role field with enum validation */}
            <form.AppField name="role">
              {(field) => (
                <field.RadioGroup
                  label="Role"
                  options={[
                    { value: 'admin', label: 'Administrator' },
                    { value: 'user', label: 'Regular User' },
                    { value: 'moderator', label: 'Moderator' },
                  ]}
                />
              )}
            </form.AppField>

            {/* Tags field with array validation */}
            <form.AppField name="tags" mode="array">
              {(field) => (
                <field.SelectMulti
                  label="Tags"
                  placeholder="Select 2-5 tags"
                  options={[
                    { id: 'javascript', label: 'JavaScript' },
                    { id: 'typescript', label: 'TypeScript' },
                    { id: 'react', label: 'React' },
                    { id: 'nodejs', label: 'Node.js' },
                    { id: 'python', label: 'Python' },
                    { id: 'java', label: 'Java' },
                  ]}
                />
              )}
            </form.AppField>

            {/* Bio field with character limit */}
            <form.AppField name="bio">
              {(field) => (
                <field.Textarea
                  label="Bio (Optional)"
                  placeholder="Tell us about yourself (max 500 characters)"
                />
              )}
            </form.AppField>

            {/* Terms checkbox with literal validation */}
            <form.AppField name="agreeToTerms">
              {(field) => (
                <field.Checkbox label="I agree to the terms and conditions" />
              )}
            </form.AppField>
          </StyledBody>

          <StyledAction>
            <form.AppForm>
              <form.SubscribeButton label="Submit Form" />
            </form.AppForm>
          </StyledAction>
        </Card>
      </form>
    </Block>
  );
};

// Transform example - data transformation on successful validation
const transformSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
  })
  .transform((data) => ({
    fullName: `${data.firstName} ${data.lastName}`,
    initials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
  }));

const TransformExampleForm = () => {
  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async (values) => {
      const result = transformSchema.safeParse(values);
      if (result.success) {
        console.info('Transformed data:', result.data);
        alert(
          `Full Name: ${result.data.fullName}\nInitials: ${result.data.initials}`,
        );
      }
    },
  });

  return (
    <Block padding="24px" width="100%" maxWidth="600px" margin="0 auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <StyledBody>
            <HeadingSmall marginBottom="8px">
              Zod v4 Transform Example
            </HeadingSmall>
            <ParagraphSmall marginBottom="24px" color="contentSecondary">
              Data is automatically transformed on validation
            </ParagraphSmall>

            <form.AppField name="firstName">
              {(field) => (
                <field.Input
                  label="First Name"
                  placeholder="Enter your first name"
                />
              )}
            </form.AppField>

            <form.AppField name="lastName">
              {(field) => (
                <field.Input
                  label="Last Name"
                  placeholder="Enter your last name"
                />
              )}
            </form.AppField>
          </StyledBody>

          <StyledAction>
            <form.AppForm>
              <form.SubscribeButton label="Transform Data" />
            </form.AppForm>
          </StyledAction>
        </Card>
      </form>
    </Block>
  );
};

// Refine example - custom cross-field validation
const refineSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    },
  );

const RefineExampleForm = () => {
  const form = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
      startDate: '',
      endDate: '',
    },
    validators: {
      onBlur: ({ value }) => {
        const result = refineSchema.safeParse(value);
        if (!result.success) {
          return result.error.format();
        }
        return undefined;
      },
    },
    onSubmit: async (values) => {
      const result = refineSchema.safeParse(values);
      if (result.success) {
        console.info('Valid data:', result.data);
        alert('Form validated successfully!');
      }
    },
  });

  return (
    <Block padding="24px" width="100%" maxWidth="600px" margin="0 auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <StyledBody>
            <HeadingSmall marginBottom="8px">
              Zod v4 Refine Example
            </HeadingSmall>
            <ParagraphSmall marginBottom="24px" color="contentSecondary">
              Custom cross-field validation with refine()
            </ParagraphSmall>

            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
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

            <form.AppField name="startDate">
              {(field) => (
                <field.Input
                  label="Start Date"
                  type="date"
                  placeholder="YYYY-MM-DD"
                />
              )}
            </form.AppField>

            <form.AppField name="endDate">
              {(field) => (
                <field.Input
                  label="End Date"
                  type="date"
                  placeholder="YYYY-MM-DD"
                />
              )}
            </form.AppField>
          </StyledBody>

          <StyledAction>
            <form.AppForm>
              <form.SubscribeButton label="Validate" />
            </form.AppForm>
          </StyledAction>
        </Card>
      </form>
    </Block>
  );
};

const meta = {
  title: 'Validation / Zod v4',
  component: ZodV4ValidationForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Zod v4 Integration

This example demonstrates the powerful validation capabilities of Zod v4 integrated with TanStack Form and BaseUI.

### Features Showcased

- **String validation**: trim(), min(), max(), regex(), email(), url()
- **Number validation**: int(), min(), max()
- **Array validation**: min(), max() with typed elements
- **Enum validation**: with custom error messages
- **Literal validation**: for checkboxes
- **Transform**: data transformation on successful validation
- **Refine**: custom cross-field validation logic
- **Real-time validation**: onChange and onBlur validators
- **Placeholder support**: All text fields support placeholder text
        `,
      },
    },
  },
} satisfies Meta<typeof ZodV4ValidationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdvancedValidation: Story = {};

export const TransformExample: Story = {
  render: () => <TransformExampleForm />,
};

export const RefineExample: Story = {
  render: () => <RefineExampleForm />,
};

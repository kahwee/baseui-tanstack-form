import { z } from 'zod';

// Zod v4 enhanced schema showcasing modern features
export const personSchema = z.object({
  // String validation with trim (Zod v4 feature)
  firstName: z
    .string()
    .trim()
    .min(3, 'First name must be at least 3 characters')
    .max(50, 'First name must not exceed 50 characters'),

  lastName: z
    .string()
    .trim()
    .min(3, 'Last name must be at least 3 characters')
    .max(50, 'Last name must not exceed 50 characters'),

  // Optional bio with character limit
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),

  // Enum for gender
  sex: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say'], {
    message: 'Please select a valid gender option',
  }),

  // Optional role with validation
  role: z.string().min(2, 'Role must be at least 2 characters').optional(),

  // Array validation with minimum requirement
  instruments: z
    .array(z.string().min(1, 'Instrument name cannot be empty'))
    .min(1, 'At least one instrument is required')
    .max(10, 'Maximum 10 instruments allowed')
    .optional(),

  // Boolean with default
  isOriginalMember: z.boolean().default(false),

  // Email validation (Zod v4 feature)
  email: z.string().email('Invalid email address').optional(),

  // URL validation (Zod v4 feature)
  website: z.string().url('Invalid URL format').optional(),

  // Age with number validation and refinement
  age: z
    .number()
    .int('Age must be a whole number')
    .min(0, 'Age cannot be negative')
    .max(150, 'Age must be realistic')
    .optional(),
});

// Custom validation example with refine
export const personSchemaWithCustomValidation = personSchema.refine(
  (data) => {
    // Custom logic: if isOriginalMember is true, age must be provided
    if (data.isOriginalMember && !data.age) {
      return false;
    }
    return true;
  },
  {
    message: 'Original members must provide their age',
    path: ['age'], // Error will be shown on the age field
  },
);

export type Person = z.infer<typeof personSchema>;

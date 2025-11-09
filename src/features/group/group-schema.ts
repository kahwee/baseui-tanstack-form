import { z } from 'zod';
import { personSchema } from '../person/person-schema';

// Zod v4 enhanced schema with advanced features
export const groupSchema = z.object({
  // Group name with trim and validation
  name: z
    .string()
    .trim()
    .min(3, 'Group name must be at least 3 characters')
    .max(100, 'Group name must not exceed 100 characters'),

  // Optional description with character limit
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),

  // Flexible date handling with union (Zod v4 improved union types)
  established: z
    .union([
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      z.date(),
      z.instanceof(Date),
    ])
    .optional(),

  // Genre with validation
  genre: z
    .string()
    .min(2, 'Genre must be at least 2 characters')
    .max(50, 'Genre must not exceed 50 characters')
    .optional(),

  // Boolean with default value
  isActive: z.boolean().default(true),

  // Albums array with validation
  albums: z
    .array(z.string().min(1, 'Album name cannot be empty'))
    .max(50, 'Maximum 50 albums allowed')
    .default([]),

  // Awards array with validation
  awards: z
    .array(z.string().min(1, 'Award name cannot be empty'))
    .max(100, 'Maximum 100 awards allowed')
    .default([]),

  // Nested array validation with person schema
  people: z
    .array(personSchema)
    .min(1, 'Group must have at least 1 member')
    .max(20, 'Maximum 20 members allowed'),

  // Email for contact (Zod v4 feature)
  contactEmail: z.string().email('Invalid email address').optional(),

  // Website URL validation (Zod v4 feature)
  website: z.string().url('Invalid website URL').optional(),

  // Social media links
  socialMedia: z
    .object({
      twitter: z.string().url('Invalid Twitter URL').optional(),
      instagram: z.string().url('Invalid Instagram URL').optional(),
      facebook: z.string().url('Invalid Facebook URL').optional(),
    })
    .optional(),

  // Number of fans with validation
  fanCount: z
    .number()
    .int('Fan count must be a whole number')
    .min(0, 'Fan count cannot be negative')
    .optional(),

  // Rating with decimal validation
  rating: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must not exceed 5')
    .optional(),
});

// Transform example: convert group name to uppercase
export const groupSchemaWithTransform = groupSchema.transform((data) => ({
  ...data,
  name: data.name.toUpperCase(),
}));

// Custom validation example with superRefine (Zod v4)
export const groupSchemaWithCustomValidation = groupSchema.refine(
  (data) => {
    // Custom logic: if group is active, it must have a contact email
    if (data.isActive && !data.contactEmail) {
      return false;
    }
    return true;
  },
  {
    message: 'Active groups must provide a contact email',
    path: ['contactEmail'],
  },
);

// Discriminated union example (Zod v4 improved discriminated unions)
export const musicGroupType = z.discriminatedUnion('groupType', [
  z.object({
    groupType: z.literal('band'),
    name: z.string(),
    leadVocalist: z.string(),
  }),
  z.object({
    groupType: z.literal('orchestra'),
    name: z.string(),
    conductor: z.string(),
  }),
  z.object({
    groupType: z.literal('choir'),
    name: z.string(),
    choirMaster: z.string(),
  }),
]);

export type Group = z.infer<typeof groupSchema>;
export type MusicGroupType = z.infer<typeof musicGroupType>;

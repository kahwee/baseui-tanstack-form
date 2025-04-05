import { z } from 'zod';
import { personSchema } from '../person/person-schema';

export const groupSchema = z.object({
  name: z.string().min(3, 'You must have a length of at least 3'),
  description: z.string().optional(),
  established: z.union([z.string(), z.date(), z.instanceof(Date)]).optional(),
  genre: z.string().optional(),
  isActive: z.boolean().optional(),
  albums: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  people: z.array(personSchema).min(1, 'You must have at least 1 person'),
});

export type Group = z.infer<typeof groupSchema>;

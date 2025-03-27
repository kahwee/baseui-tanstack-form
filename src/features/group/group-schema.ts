import { z } from 'zod'
import { PersonSchema } from '../person/person-schema';

export const groupSchema = z.object({
  name: z
    .string()
    .min(3, 'You must have a length of at least 3'),
  people: z.array(PersonSchema).min(1, "You must have at least 1 person"),
})

export type Group = z.infer<typeof groupSchema>;
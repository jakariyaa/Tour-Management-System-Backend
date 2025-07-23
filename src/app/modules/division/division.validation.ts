import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  thumbnail: z.url({ error: "Thumbnail must be url" }).optional(),
  description: z.string({ error: "Description must be string" }).optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z
    .string({ error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  thumbnail: z.url({ error: "Thumbnail must be url" }).optional(),
  description: z.string({ error: "Description must be string" }).optional(),
});

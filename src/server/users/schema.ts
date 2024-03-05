import { z } from "zod";

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  passwordHash: z.string(),
  passwordSalt: z.string(),
});

export const createUserSchema = userSchema
  .omit({
    id: true,
    passwordHash: true,
    passwordSalt: true,
  })
  .extend({ password: z.string().min(8) });
export const updateUserSchema = createUserSchema.partial();

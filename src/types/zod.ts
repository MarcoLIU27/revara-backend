import { z } from 'zod';

// _____________  User Schema  Login  _____________

const userBaseSchema = {
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'password must be at least 1 characters long' }).max(50, {
    message: 'password cannot be longer than 50 characters',
  }),
};

export const userSchema = z.object(userBaseSchema);

// _____________  User Schema  Signup  _____________

export const userSignupSchema = z.object({
  fullName: z.string().min(1, { message: 'fullName must be at least 1 characters long' }).max(100, {
    message: 'fullName cannot be longer than 100 characters',
  }),
  username: z.string().min(1, { message: 'username must be at least 1 characters long' }).max(50, {
    message: 'username cannot be longer than 50 characters',
  }),
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'password must be at least 1 characters long' }).max(50, {
    message: 'password cannot be longer than 50 characters',
  }),
});

// _____________  User Schema  Update  _____________

export const userUpdateSchema = z.object({
  password: z.string().min(1, { message: 'password must be at least 1 characters long' }).max(50, {
    message: 'password cannot be longer than 50 characters',
  }).optional(),
  fullName: z.string().min(1, { message: 'fullName must be at least 1 characters long' }).max(100, {
    message: 'fullName cannot be longer than 100 characters',
  }).optional(),
});

// _____________  Cash Buyer Submission Schema  _____________

export const cashBuyerSubmissionSchema = z.object({
  name: z.string().min(1, { message: 'name must be at least 1 characters long' }).max(100, {
    message: 'name cannot be longer than 100 characters',
  }),
  address: z.string().optional(),
  phone: z.string().max(20, {
    message: 'phone cannot be longer than 20 characters',
  }).optional(),
  email: z.string().email({ message: 'Invalid email format' }).max(100, {
    message: 'email cannot be longer than 100 characters',
  }).optional(),
});

// _____________  Export Types   _____________

export type TUserSchema = z.infer<typeof userSchema>;
export type TuserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type TUserSignupSchema = z.infer<typeof userSignupSchema>;
export type TCashBuyerSubmissionSchema = z.infer<typeof cashBuyerSubmissionSchema>;

import { z } from "zod";

export const debtTypeEnum = z.enum(["I_OWE", "OWED_TO_ME"]);
export const debtStatusEnum = z.enum(["OPEN", "CLOSED", "ARCHIVED"]);

export const createDebtSchema = z.object({
  type: debtTypeEnum,
  contactId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  principalAmount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3).default("USD"),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().optional(),
  interestRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const updateDebtSchema = createDebtSchema.partial().extend({
  status: debtStatusEnum.optional(),
});

export type CreateDebtInput = z.infer<typeof createDebtSchema>;
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;

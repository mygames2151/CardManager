import { z } from "zod";

export const cardSchema = z.object({
  id: z.string(),
  idNumber: z.string().length(3).regex(/^\d{3}$/),
  code: z.string().length(3).regex(/^[A-Z]{3}$/),
  firstName: z.string().min(1),
  surname: z.string().min(1),
  city: z.string().min(1),
  identity: z.string().min(1),
  gender: z.enum(["male", "female"]),
  maritalStatus: z.enum(["single", "married"]),
  socialPlatform: z.string().optional(),
  socialId: z.string().url().optional(),
  driveLink: z.string().url().optional(),
  profilePicture: z.string().optional(),
  createdAt: z.date(),
});

export const insertCardSchema = cardSchema.omit({ id: true, createdAt: true });

export const excelFileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  data: z.array(z.array(z.string())),
  lastModified: z.date(),
});

export const insertExcelFileSchema = excelFileSchema.omit({ id: true, lastModified: true });

export const mediaFileSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  name: z.string(),
  type: z.enum(["image", "video"]),
  data: z.string(), // base64 encoded
  createdAt: z.date(),
});

export const insertMediaFileSchema = mediaFileSchema.omit({ id: true, createdAt: true });

export type Card = z.infer<typeof cardSchema>;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type ExcelFile = z.infer<typeof excelFileSchema>;
export type InsertExcelFile = z.infer<typeof insertExcelFileSchema>;
export type MediaFile = z.infer<typeof mediaFileSchema>;
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;

import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const MovieSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  duration: z.number().positive(),
  releaseDate: z.string().datetime(),
  posterUrl: z.string().url(),
  backgroundUrl: z.string().url(),
  videoUrl: z.string().url(),
  categoryId: z.string(),
});

export const SeriesSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  totalSeasons: z.number().positive(),
  totalEpisodes: z.number().positive(),
  releaseDate: z.string().datetime(),
  posterUrl: z.string().url(),
  backgroundUrl: z.string().url(),
  videoUrl: z.string().url(),
  categoryId: z.string(),
});

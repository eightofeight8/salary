import type { z } from 'zod';
import type { VercelResponse } from '@vercel/node';

/**
 * Обертка над Zod safeParse: при ошибке сама отвечает 400 и возвращает null.
 */
export function validateBody<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  res: VercelResponse,
): z.infer<T> | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    res.status(400).json({
      error: 'Ошибка валидации данных',
      details: result.error.flatten().fieldErrors,
    });
    return null;
  }
  return result.data;
}

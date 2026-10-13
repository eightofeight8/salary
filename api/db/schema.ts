import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  color: text('color').default('#64748b'),
  icon: text('icon').default('tag'),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  amount: real('amount').notNull(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  date: text('date').notNull(),
  comment: text('comment'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

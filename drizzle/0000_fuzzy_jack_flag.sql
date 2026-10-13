CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`color` text DEFAULT '#64748b',
	`icon` text DEFAULT 'tag'
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`type` text NOT NULL,
	`category_id` text NOT NULL,
	`date` text NOT NULL,
	`comment` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict
);

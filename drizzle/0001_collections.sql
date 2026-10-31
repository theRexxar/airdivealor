CREATE TABLE `cms_settings` (
	`key` varchar(80) NOT NULL,
	`value` json NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `cms_settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `collection_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`collection` varchar(40) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`sort` int NOT NULL DEFAULT 0,
	`enabled` boolean NOT NULL DEFAULT true,
	`draft` json NOT NULL,
	`published` json,
	`draft_updated_at` datetime,
	`draft_updated_by` int,
	`published_at` datetime,
	`published_by` int,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `collection_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `collection_items_slug_uq` UNIQUE(`collection`,`slug`)
);
--> statement-breakpoint
ALTER TABLE `collection_items` ADD CONSTRAINT `collection_items_draft_updated_by_users_id_fk` FOREIGN KEY (`draft_updated_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_items` ADD CONSTRAINT `collection_items_published_by_users_id_fk` FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `collection_items_sort_idx` ON `collection_items` (`collection`,`sort`);
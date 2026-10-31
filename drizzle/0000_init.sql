CREATE TABLE `audit_logs` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`action` varchar(80) NOT NULL,
	`target` varchar(160) NOT NULL DEFAULT '',
	`meta` json,
	`ip` varchar(64),
	`created_at` datetime NOT NULL,
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` enum('image','video') NOT NULL,
	`status` enum('uploading','processing','ready','failed') NOT NULL DEFAULT 'uploading',
	`original_key` varchar(255) NOT NULL,
	`original_name` varchar(255) NOT NULL,
	`mime` varchar(100) NOT NULL,
	`size` bigint NOT NULL,
	`width` int,
	`height` int,
	`duration_sec` int,
	`variants` json NOT NULL,
	`poster_key` varchar(255),
	`alt_en` varchar(255) NOT NULL DEFAULT '',
	`alt_id` varchar(255) NOT NULL DEFAULT '',
	`error` text,
	`attempts` int NOT NULL DEFAULT 0,
	`created_by` int,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_sections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page_id` int NOT NULL,
	`key` varchar(60) NOT NULL,
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
	CONSTRAINT `page_sections_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_sections_page_key_uq` UNIQUE(`page_id`,`key`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(80) NOT NULL,
	`title` varchar(120) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `password_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`kind` enum('reset','invite') NOT NULL,
	`expires_at` datetime NOT NULL,
	`used_at` datetime,
	`created_at` datetime NOT NULL,
	CONSTRAINT `password_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_tokens_hash_uq` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` int NOT NULL,
	`permission` varchar(80) NOT NULL,
	CONSTRAINT `role_permissions_role_id_permission_pk` PRIMARY KEY(`role_id`,`permission`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(60) NOT NULL,
	`description` varchar(255) NOT NULL DEFAULT '',
	`is_system` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_uq` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`expires_at` datetime NOT NULL,
	`ip` varchar(64),
	`user_agent` varchar(255),
	`created_at` datetime NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` int NOT NULL,
	`role_id` int NOT NULL,
	CONSTRAINT `user_roles_user_id_role_id_pk` PRIMARY KEY(`user_id`,`role_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(191) NOT NULL,
	`name` varchar(120) NOT NULL,
	`password_hash` varchar(100),
	`status` enum('active','invited','disabled') NOT NULL DEFAULT 'invited',
	`last_login_at` datetime,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_sections` ADD CONSTRAINT `page_sections_page_id_pages_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_sections` ADD CONSTRAINT `page_sections_draft_updated_by_users_id_fk` FOREIGN KEY (`draft_updated_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `page_sections` ADD CONSTRAINT `page_sections_published_by_users_id_fk` FOREIGN KEY (`published_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `password_tokens` ADD CONSTRAINT `password_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_created_idx` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `media_status_idx` ON `media` (`status`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);
CREATE TABLE IF NOT EXISTS "github_configs" (
  "id" serial PRIMARY KEY,
  "type" text NOT NULL,
  "value" text NOT NULL,
  "display_name" text,
  "description" text,
  "is_enabled" boolean NOT NULL DEFAULT true,
  "order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
); 
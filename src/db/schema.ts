import { boolean, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const leadStageEnum = pgEnum("lead_stage", [
  "new_lead",
  "contacted",
  "counselling",
  "profile_assessment",
  "university_selection",
  "application",
  "offer_received",
  "visa_preparation",
  "visa_submitted",
  "visa_decision",
  "pre_departure",
  "completed",
]);

export const leadTypeEnum = pgEnum("lead_type", ["consultation", "profile_assessment", "event", "destination_finder"]);

export const leads = pgTable("education_leads", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 200 }),
  preferredCountry: varchar("preferred_country", { length: 120 }),
  studyLevel: varchar("study_level", { length: 100 }),
  preferredSubject: varchar("preferred_subject", { length: 180 }),
  currentQualification: varchar("current_qualification", { length: 180 }),
  preferredIntake: varchar("preferred_intake", { length: 100 }),
  estimatedBudget: varchar("estimated_budget", { length: 120 }),
  message: text("message"),
  internalNotes: text("internal_notes"),
  type: leadTypeEnum("type").default("consultation").notNull(),
  stage: leadStageEnum("stage").default("new_lead").notNull(),
  source: varchar("source", { length: 100 }).default("website").notNull(),
  consent: boolean("consent").default(false).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profileAssessments = pgTable("profile_assessments", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id, { onDelete: "cascade" }).notNull(),
  currentCountry: varchar("current_country", { length: 120 }),
  academicLevel: varchar("academic_level", { length: 120 }),
  highestQualification: varchar("highest_qualification", { length: 180 }),
  institution: varchar("institution", { length: 220 }),
  subjectMajor: varchar("subject_major", { length: 180 }),
  resultGpa: varchar("result_gpa", { length: 100 }),
  graduationYear: varchar("graduation_year", { length: 20 }),
  studyGap: varchar("study_gap", { length: 120 }),
  englishTest: varchar("english_test", { length: 80 }),
  englishScore: varchar("english_score", { length: 80 }),
  preferredDegree: varchar("preferred_degree", { length: 120 }),
  scholarshipInterest: boolean("scholarship_interest").default(false).notNull(),
  workExperience: text("work_experience"),
  careerGoal: text("career_goal"),
  previousVisaRefusal: boolean("previous_visa_refusal").default(false).notNull(),
  additionalInformation: text("additional_information"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  displayName: varchar("display_name", { length: 160 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => adminUsers.id, { onDelete: "cascade" }).notNull(),
  tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contentEntries = pgTable("content_entries", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 60 }).notNull(),
  slug: varchar("slug", { length: 190 }).notNull(),
  title: varchar("title", { length: 250 }).notNull(),
  subtitle: varchar("subtitle", { length: 250 }),
  summary: text("summary"),
  body: text("body"),
  category: varchar("category", { length: 120 }),
  data: jsonb("data").$type<Record<string, unknown>>().default({}).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  seoTitle: varchar("seo_title", { length: 250 }),
  seoDescription: text("seo_description"),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("content_entries_type_slug_idx").on(table.type, table.slug)]);

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  data: jsonb("data").$type<Record<string, unknown>>().default({}).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 80 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  altText: varchar("alt_text", { length: 300 }),
  dataBase64: text("data_base64").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;

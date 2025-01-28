CREATE TYPE "public"."career_company_size" AS ENUM('1To10', '11To40', '41To100', '100More');--> statement-breakpoint
CREATE TYPE "public"."career_language_level" AS ENUM('beginner', 'elementary', 'intermediate', 'advanced', 'fluent');--> statement-breakpoint
CREATE TYPE "public"."career_remote" AS ENUM('yes', 'sometimes', 'no');--> statement-breakpoint
CREATE TYPE "public"."career_role_level" AS ENUM('student', 'junior', 'mid', 'senior');--> statement-breakpoint
CREATE TYPE "public"."job_category" AS ENUM('technicalRoles', 'businessRoles', 'productDesign', 'marketingCommunity', 'operationsSupport', 'researchEducation', 'financeCompliance', 'more');--> statement-breakpoint
CREATE TYPE "public"."job_name" AS ENUM('fullStackDeveloper', 'backendEngineer', 'frontendEngineer', 'mobileAppDeveloper', 'devOpsEngineer', 'cloudInfrastructureEngineer', 'dataEngineer', 'protocolEngineer', 'technicalProductManager', 'technicalSupportEngineer', 'cybersecurity', 'cryptographer', 'businessDevelopmentManager', 'sales', 'businessAnalyst', 'revenueManager', 'productManager', 'uiUxDesigner', 'uxResearcher', 'brandStrategist', 'graphicDesigner', 'marketingManager', 'socialMediaManager', 'communityManager', 'publicRelationsManager', 'eventCoordinator', 'seoSpecialist', 'operationsManager', 'customerSupportSpecialist', 'customerSuccessManager', 'logisticManager', 'researcher', 'economicAnalyst', 'educator', 'contentWriter', 'technicalWriter', 'complianceOfficer', 'amlKycSpecialist', 'riskAnalyst', 'accountingManager', 'bitcoinInvestmentAnalyst', 'hrSpecialist', 'legalContractSpecialist', 'miningEngineer', 'miningOperationsManager');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."career_company_sizes" (
	"career_profile_id" uuid NOT NULL,
	"size" "career_company_size" NOT NULL,
	CONSTRAINT "career_company_sizes_career_profile_id_size_pk" PRIMARY KEY("career_profile_id","size")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."career_languages" (
	"career_profile_id" uuid NOT NULL,
	"language_code" text NOT NULL,
	"level" "career_language_level" NOT NULL,
	CONSTRAINT "career_languages_career_profile_id_language_code_pk" PRIMARY KEY("career_profile_id","language_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."career_profiles" (
	"uid" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"country" text,
	"email" text,
	"linkedin" text,
	"github" text,
	"telegram" text,
	"other_contact" text,
	"is_bitcoin_community_participant" boolean DEFAULT false NOT NULL,
	"bitcoin_community_text" text,
	"is_bitcoin_project_participant" boolean DEFAULT false NOT NULL,
	"bitcoin_project_text" text,
	"is_available_full_time" boolean DEFAULT true NOT NULL,
	"remote_work_preference" "career_remote" DEFAULT 'yes' NOT NULL,
	"expected_salary" text,
	"availability_start" text,
	"cv_url" text,
	"motivation_letter" text,
	"are_terms_accepted" boolean DEFAULT false NOT NULL,
	"allow_receiving_emails" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"edited_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "career_profiles_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."career_roles" (
	"career_profile_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"level" "career_role_level" NOT NULL,
	CONSTRAINT "career_roles_career_profile_id_role_id_pk" PRIMARY KEY("career_profile_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."job_titles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" "job_name" NOT NULL,
	"category" "job_category" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users"."languages" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"native_name" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."career_company_sizes" ADD CONSTRAINT "career_company_sizes_career_profile_id_career_profiles_id_fk" FOREIGN KEY ("career_profile_id") REFERENCES "users"."career_profiles"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."career_languages" ADD CONSTRAINT "career_languages_career_profile_id_career_profiles_id_fk" FOREIGN KEY ("career_profile_id") REFERENCES "users"."career_profiles"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."career_languages" ADD CONSTRAINT "career_languages_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "users"."languages"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."career_profiles" ADD CONSTRAINT "career_profiles_uid_accounts_uid_fk" FOREIGN KEY ("uid") REFERENCES "users"."accounts"("uid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."career_roles" ADD CONSTRAINT "career_roles_career_profile_id_career_profiles_id_fk" FOREIGN KEY ("career_profile_id") REFERENCES "users"."career_profiles"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users"."career_roles" ADD CONSTRAINT "career_roles_role_id_job_titles_id_fk" FOREIGN KEY ("role_id") REFERENCES "users"."job_titles"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "users"."job_titles" ("id", "name", "category") VALUES
(uuid_generate_v4(), 'fullStackDeveloper', 'technicalRoles'),
(uuid_generate_v4(), 'backendEngineer', 'technicalRoles'),
(uuid_generate_v4(), 'frontendEngineer', 'technicalRoles'),
(uuid_generate_v4(), 'mobileAppDeveloper', 'technicalRoles'),
(uuid_generate_v4(), 'devOpsEngineer', 'technicalRoles'),
(uuid_generate_v4(), 'cloudInfrastructureEngineer', 'technicalRoles'),
(uuid_generate_v4(), 'dataEngineer', 'technicalRoles'),
(uuid_generate_v4(), 'protocolEngineer', 'technicalRoles'),
(uuid_generate_v4(), 'technicalProductManager', 'technicalRoles'),
(uuid_generate_v4(), 'technicalSupportEngineer', 'technicalRoles'),
(uuid_generate_v4(), 'cybersecurity', 'technicalRoles'),
(uuid_generate_v4(), 'cryptographer', 'technicalRoles'),
(uuid_generate_v4(), 'businessDevelopmentManager', 'businessRoles'),
(uuid_generate_v4(), 'sales', 'businessRoles'),
(uuid_generate_v4(), 'businessAnalyst', 'businessRoles'),
(uuid_generate_v4(), 'revenueManager', 'businessRoles'),
(uuid_generate_v4(), 'productManager', 'productDesign'),
(uuid_generate_v4(), 'uiUxDesigner', 'productDesign'),
(uuid_generate_v4(), 'uxResearcher', 'productDesign'),
(uuid_generate_v4(), 'brandStrategist', 'productDesign'),
(uuid_generate_v4(), 'graphicDesigner', 'productDesign'),
(uuid_generate_v4(), 'marketingManager', 'marketingCommunity'),
(uuid_generate_v4(), 'socialMediaManager', 'marketingCommunity'),
(uuid_generate_v4(), 'communityManager', 'marketingCommunity'),
(uuid_generate_v4(), 'publicRelationsManager', 'marketingCommunity'),
(uuid_generate_v4(), 'eventCoordinator', 'marketingCommunity'),
(uuid_generate_v4(), 'seoSpecialist', 'marketingCommunity'),
(uuid_generate_v4(), 'operationsManager', 'operationsSupport'),
(uuid_generate_v4(), 'customerSupportSpecialist', 'operationsSupport'),
(uuid_generate_v4(), 'customerSuccessManager', 'operationsSupport'),
(uuid_generate_v4(), 'logisticManager', 'operationsSupport'),
(uuid_generate_v4(), 'researcher', 'researchEducation'),
(uuid_generate_v4(), 'economicAnalyst', 'researchEducation'),
(uuid_generate_v4(), 'educator', 'researchEducation'),
(uuid_generate_v4(), 'contentWriter', 'researchEducation'),
(uuid_generate_v4(), 'technicalWriter', 'researchEducation'),
(uuid_generate_v4(), 'complianceOfficer', 'financeCompliance'),
(uuid_generate_v4(), 'amlKycSpecialist', 'financeCompliance'),
(uuid_generate_v4(), 'riskAnalyst', 'financeCompliance'),
(uuid_generate_v4(), 'accountingManager', 'financeCompliance'),
(uuid_generate_v4(), 'bitcoinInvestmentAnalyst', 'financeCompliance'),
(uuid_generate_v4(), 'hrSpecialist', 'more'),
(uuid_generate_v4(), 'legalContractSpecialist', 'more'),
(uuid_generate_v4(), 'miningEngineer', 'more'),
(uuid_generate_v4(), 'miningOperationsManager', 'more');

INSERT INTO "users"."languages" ("code", "name", "native_name") VALUES
('ach', 'Acholi', 'Lwo'),
('ady', 'Adyghe', 'Адыгэбзэ'),
('af', 'Afrikaans', 'Afrikaans'),
('ak', 'Akan', 'Tɕɥi'),
('ar', 'Arabic', 'العربية'),
('ay-BO', 'Aymara', 'Aymar aru'),
('az', 'Azerbaijani', 'Azərbaycan dili'),
('be-BY', 'Belarusian', 'Беларуская'),
('bg', 'Bulgarian', 'Български'),
('bn', 'Bengali', 'বাংলা'),
('br', 'Breton', 'Brezhoneg'),
('bs-BA', 'Bosnian', 'Bosanski'),
('ca', 'Catalan', 'Català'),
('cak', 'Kaqchikel', 'Maya Kaqchikel'),
('ck-US', 'Cherokee', 'ᏣᎳᎩ (tsalagi)'),
('cs', 'Czech', 'Čeština'),
('cy', 'Welsh', 'Cymraeg'),
('da', 'Danish', 'Dansk'),
('de', 'German', 'Deutsch'),
('dsb', 'Lower Sorbian', 'Dolnoserbšćina'),
('el', 'Greek', 'Ελληνικά'),
('en', 'English', 'English'),
('eo', 'Esperanto', 'Esperanto'),
('es', 'Spanish', 'Español'),
('et', 'Estonian', 'eesti keel'),
('eu', 'Basque', 'Euskara'),
('fa', 'Persian', 'فارسی'),
('fb-LT', 'Leet', 'Leet Speak'),
('ff', 'Fulah', 'Fulah'),
('fi', 'Finnish', 'Suomi'),
('fo', 'Faroese', 'Føroyskt'),
('fr', 'French', 'Français'),
('fy-NL', 'Frisian (West)', 'Frysk'),
('ga', 'Irish', 'Gaeilge'),
('gd', 'Gaelic', 'Gàidhlig'),
('gl', 'Galician', 'Galego'),
('gn-PY', 'Guarani', 'Avañe'),
('gu-IN', 'Gujarati', 'ગુજરાતી'),
('gv', 'Manx', 'Gaelg'),
('gx-GR', 'Classical Greek', 'Ἑλληνική ἀρχαία'),
('he', 'Hebrew', 'עברית'),
('hi', 'Hindi', 'हिन्दी'),
('hr', 'Croatian', 'Hrvatski'),
('hsb', 'Upper Sorbian', 'Hornjoserbšćina'),
('ht', 'Haitian Creole', 'Kreyòl'),
('hu', 'Hungarian', 'Magyar'),
('hy', 'Armenian', 'Հայերեն'),
('id', 'Indonesian', 'Bahasa Indonesia'),
('is', 'Icelandic', 'Íslenska'),
('it', 'Italian', 'Italiano'),
('ja', 'Japanese', '日本語'),
('jv-ID', 'Javanese', 'Basa Jawa'),
('ka-GE', 'Georgian', 'ქართული'),
('kk-KZ', 'Kazakh', 'Қазақша'),
('km', 'Khmer', 'ភាសាខ្មែរ'),
('kl', 'Greenlandic', 'kalaallisut'),
('kab', 'Kabyle', 'Taqbaylit'),
('kn', 'Kannada', 'ಕನ್ನಡ'),
('ko', 'Korean', '한국어'),
('ku-TR', 'Kurdish', 'Kurdî'),
('kw', 'Cornish', 'Kernewek'),
('la', 'Latin', 'Latin'),
('lb', 'Luxembourgish', 'Lëtzebuergesch'),
('li-NL', 'Limburgish', 'Lèmbörgs'),
('lt', 'Lithuanian', 'Lietuvių'),
('lv', 'Latvian', 'Latviešu'),
('mai', 'Maithili', 'मैथिली, মৈথিলী'),
('mg-MG', 'Malagasy', 'Malagasy'),
('mk', 'Macedonian', 'Македонски'),
('ml', 'Malayalam', 'മലയാളം'),
('mn-MN', 'Mongolian', 'Монгол'),
('mr', 'Marathi', 'मराठी'),
('ms', 'Malay', 'Bahasa Melayu'),
('mt', 'Maltese', 'Malti'),
('my', 'Burmese', 'ဗမာစကာ'),
('no', 'Norwegian', 'Norsk'),
('nb', 'Norwegian (bokmal)', 'Norsk (bokmål)'),
('ne', 'Nepali', 'नेपाली'),
('nl', 'Dutch', 'Nederlands'),
('nn-NO', 'Norwegian (nynorsk)', 'Norsk (nynorsk)'),
('oc', 'Occitan', 'Occitan'),
('or-IN', 'Oriya', 'ଓଡ଼ିଆ'),
('pa', 'Punjabi', 'ਪੰਜਾਬੀ'),
('pl', 'Polish', 'Polski'),
('ps-AF', 'Pashto', 'پښتو'),
('pt', 'Portuguese', 'Português'),
('qu-PE', 'Quechua', 'Qhichwa'),
('rm-CH', 'Romansh', 'Rumantsch'),
('ro', 'Romanian', 'Română'),
('ru', 'Russian', 'Русский'),
('sa-IN', 'Sanskrit', 'संस्कृतम्'),
('se-NO', 'Northern Sámi', 'Davvisámegiella'),
('sh', 'Serbo-Croatian', 'српскохрватски'),
('si-LK', 'Sinhala (Sri Lanka)', 'සිංහල'),
('sk', 'Slovak', 'Slovenčina'),
('sl', 'Slovenian', 'Slovenščina'),
('so-SO', 'Somali', 'Soomaaliga'),
('sq', 'Albanian', 'Shqip'),
('sr', 'Serbian', 'Српски'),
('su', 'Sundanese', 'Basa Sunda'),
('sv', 'Swedish', 'Svenska'),
('sw', 'Swahili', 'Kiswahili'),
('ta', 'Tamil', 'தமிழ்'),
('te', 'Telugu', 'తెలుగు'),
('tg', 'Tajik', 'забо́ни тоҷикӣ́'),
('th', 'Thai', 'ภาษาไทย'),
('fil', 'Filipino', 'Filipino'),
('tlh', 'Klingon', 'tlhIngan-Hol'),
('tr', 'Turkish', 'Türkçe'),
('tt-RU', 'Tatar', 'татарча'),
('uk', 'Ukrainian', 'Українська'),
('ur', 'Urdu', 'اردو'),
('uz', 'Uzbek', 'O zbek'),
('vi', 'Vietnamese', 'Tiếng Việt'),
('xh-ZA', 'Xhosa', 'isiXhosa'),
('yi', 'Yiddish', 'ייִדיש'),
('zh', 'Chinese', '中文'),
('zh-Hans', 'Chinese Simplified', '中文简体'),
('zh-Hant', 'Chinese Traditional', '中文繁體'),
('zh-CN', 'Chinese Simplified (China)', '中文（中国大陆）'),
('zh-HK', 'Chinese Traditional (Hong Kong)', '中文（香港）'),
('zh-SG', 'Chinese Simplified (Singapore)', '中文（新加坡）'),
('zh-TW', 'Chinese Traditional (Taiwan)', '中文（台灣）'),
('zu-ZA', 'Zulu', 'isiZulu');

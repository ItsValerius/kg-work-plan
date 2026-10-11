CREATE TABLE "kg-work-plan_jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"publicKey" text NOT NULL,
	"privateKey" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"expiresAt" timestamp,
	"alg" text,
	"crv" text
);
--> statement-breakpoint
CREATE TABLE "kg-work-plan_oauth_access_token" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"clientId" text NOT NULL,
	"sessionId" text,
	"userId" text,
	"referenceId" text,
	"authorizationCodeId" text,
	"resources" text[],
	"requestedUserInfoClaims" text[],
	"refreshId" text,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL,
	"revoked" timestamp,
	"confirmation" jsonb,
	"scopes" text[] NOT NULL,
	CONSTRAINT "kg-work-plan_oauth_access_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "kg-work-plan_oauth_client" (
	"id" text PRIMARY KEY NOT NULL,
	"clientId" text NOT NULL,
	"clientSecret" text,
	"clientDiscoveryId" text,
	"disabled" boolean DEFAULT false,
	"skipConsent" boolean,
	"enableEndSession" boolean,
	"subjectType" text,
	"scopes" text[],
	"clientCredentialsScopes" text[] DEFAULT '{}',
	"userId" text,
	"createdAt" timestamp,
	"updatedAt" timestamp,
	"name" text,
	"uri" text,
	"icon" text,
	"contacts" text[],
	"tos" text,
	"policy" text,
	"softwareId" text,
	"softwareVersion" text,
	"softwareStatement" text,
	"redirectUris" text[] NOT NULL,
	"postLogoutRedirectUris" text[],
	"backchannelLogoutUri" text,
	"backchannelLogoutSessionRequired" boolean,
	"tokenEndpointAuthMethod" text,
	"applicationType" text,
	"jwks" text,
	"jwksUri" text,
	"grantTypes" text[],
	"responseTypes" text[],
	"requirePKCE" boolean,
	"dpopBoundAccessTokens" boolean DEFAULT false,
	"referenceId" text,
	"metadata" jsonb,
	CONSTRAINT "kg-work-plan_oauth_client_clientId_unique" UNIQUE("clientId")
);
--> statement-breakpoint
CREATE TABLE "kg-work-plan_oauth_client_assertion" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kg-work-plan_oauth_client_resource" (
	"id" text PRIMARY KEY NOT NULL,
	"clientId" text NOT NULL,
	"resourceId" text NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "kg-work-plan_oauth_consent" (
	"id" text PRIMARY KEY NOT NULL,
	"clientId" text NOT NULL,
	"userId" text,
	"referenceId" text,
	"resources" text[],
	"requestedUserInfoClaims" text[],
	"scopes" text[] NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kg-work-plan_oauth_refresh_token" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"clientId" text NOT NULL,
	"sessionId" text,
	"userId" text NOT NULL,
	"referenceId" text,
	"authorizationCodeId" text,
	"resources" text[],
	"requestedUserInfoClaims" text[],
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL,
	"revoked" timestamp,
	"rotatedAt" timestamp,
	"rotationReplayResponse" text,
	"rotationReplayExpiresAt" timestamp,
	"authTime" timestamp,
	"confirmation" jsonb,
	"scopes" text[] NOT NULL,
	CONSTRAINT "kg-work-plan_oauth_refresh_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "kg-work-plan_oauth_resource" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"name" text NOT NULL,
	"accessTokenTtl" integer,
	"refreshTokenTtl" integer,
	"signingAlgorithm" text,
	"signingKeyId" text,
	"allowedScopes" text[],
	"customClaims" jsonb,
	"dpopBoundAccessTokensRequired" boolean DEFAULT false,
	"disabled" boolean DEFAULT false,
	"createdAt" timestamp,
	"updatedAt" timestamp,
	"policyVersion" integer DEFAULT 1,
	"metadata" jsonb,
	CONSTRAINT "kg-work-plan_oauth_resource_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_access_token" ADD CONSTRAINT "kg-work-plan_oauth_access_token_clientId_kg-work-plan_oauth_client_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "public"."kg-work-plan_oauth_client"("clientId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_access_token" ADD CONSTRAINT "kg-work-plan_oauth_access_token_sessionId_kg-work-plan_session_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."kg-work-plan_session"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_access_token" ADD CONSTRAINT "kg-work-plan_oauth_access_token_userId_kg-work-plan_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_access_token" ADD CONSTRAINT "kg-work-plan_oauth_access_token_refreshId_kg-work-plan_oauth_refresh_token_id_fk" FOREIGN KEY ("refreshId") REFERENCES "public"."kg-work-plan_oauth_refresh_token"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_client" ADD CONSTRAINT "kg-work-plan_oauth_client_userId_kg-work-plan_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_client_resource" ADD CONSTRAINT "kg-work-plan_oauth_client_resource_clientId_kg-work-plan_oauth_client_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "public"."kg-work-plan_oauth_client"("clientId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_client_resource" ADD CONSTRAINT "kg-work-plan_oauth_client_resource_resourceId_kg-work-plan_oauth_resource_identifier_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."kg-work-plan_oauth_resource"("identifier") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_consent" ADD CONSTRAINT "kg-work-plan_oauth_consent_clientId_kg-work-plan_oauth_client_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "public"."kg-work-plan_oauth_client"("clientId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_consent" ADD CONSTRAINT "kg-work-plan_oauth_consent_userId_kg-work-plan_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_refresh_token" ADD CONSTRAINT "kg-work-plan_oauth_refresh_token_clientId_kg-work-plan_oauth_client_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "public"."kg-work-plan_oauth_client"("clientId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_refresh_token" ADD CONSTRAINT "kg-work-plan_oauth_refresh_token_sessionId_kg-work-plan_session_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."kg-work-plan_session"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kg-work-plan_oauth_refresh_token" ADD CONSTRAINT "kg-work-plan_oauth_refresh_token_userId_kg-work-plan_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."kg-work-plan_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "oauthAccessToken_clientId_idx" ON "kg-work-plan_oauth_access_token" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "oauthAccessToken_sessionId_idx" ON "kg-work-plan_oauth_access_token" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "oauthAccessToken_userId_idx" ON "kg-work-plan_oauth_access_token" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "oauthAccessToken_authorizationCodeId_idx" ON "kg-work-plan_oauth_access_token" USING btree ("authorizationCodeId");--> statement-breakpoint
CREATE INDEX "oauthAccessToken_refreshId_idx" ON "kg-work-plan_oauth_access_token" USING btree ("refreshId");--> statement-breakpoint
CREATE INDEX "oauthClient_userId_idx" ON "kg-work-plan_oauth_client" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "oauthClientResource_clientId_resourceId_uidx" ON "kg-work-plan_oauth_client_resource" USING btree ("clientId","resourceId");--> statement-breakpoint
CREATE INDEX "oauthClientResource_clientId_idx" ON "kg-work-plan_oauth_client_resource" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "oauthClientResource_resourceId_idx" ON "kg-work-plan_oauth_client_resource" USING btree ("resourceId");--> statement-breakpoint
CREATE INDEX "oauthConsent_clientId_idx" ON "kg-work-plan_oauth_consent" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "oauthConsent_userId_idx" ON "kg-work-plan_oauth_consent" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "oauthRefreshToken_clientId_idx" ON "kg-work-plan_oauth_refresh_token" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "oauthRefreshToken_sessionId_idx" ON "kg-work-plan_oauth_refresh_token" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "oauthRefreshToken_userId_idx" ON "kg-work-plan_oauth_refresh_token" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "oauthRefreshToken_authorizationCodeId_idx" ON "kg-work-plan_oauth_refresh_token" USING btree ("authorizationCodeId");
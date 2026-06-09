# LedgerPilot Kenya — Comprehensive Build To-Do List

> Phased development plan across Discovery, MVP, Pilot, Launch, and Automation layers.

---

## How to Use This List

- Work through phases in order — each phase unlocks the next.
- Tasks marked `[BLOCKER]` must be completed before moving forward.
- Tasks marked `[PARALLEL]` can run alongside other work in the same phase.
- Check off tasks as you go using `[x]`.

---

## Phase 1: Discovery and Validation
**Goal:** Confirm assumptions before writing a single line of code.
**Target duration:** 3–4 weeks

### 1.1 Research and Interviews
- [ ] Identify and contact 10 bookkeepers for structured interviews
- [ ] Identify and contact 10 SME owners for structured interviews
- [ ] Identify and contact 3 tax consultants or KRA-registered practitioners
- [ ] Prepare interview scripts (bookkeeper version, SME version, tax consultant version)
- [ ] Conduct all interviews (in-person or virtual)
- [ ] Document pain points, current tools, and workflow gaps per interviewee
- [ ] Identify the top 5 recurring problems across all interviews
- [ ] Identify the top 3 features interviewees would pay for immediately

### 1.2 Process Mapping
- [ ] Map the full monthly bookkeeping close process (step by step)
- [ ] Map the Kenya tax compliance calendar (all obligations, due dates, filing windows)
- [ ] Map how bookkeepers currently collect documents from clients
- [ ] Map payroll processing steps and where errors typically occur
- [ ] Document common reconciliation pain points (bank, M-Pesa, petty cash)
- [ ] Identify which manual steps waste the most time

### 1.3 Chart of Accounts Definition
- [ ] Define minimum Kenya SME chart of accounts (assets, liabilities, equity, income, expenses)
- [ ] Define industry-specific variations: retail, service, clinic, school, NGO
- [ ] Review with at least 2 practising accountants before finalising
- [ ] Document account code numbering convention

### 1.4 Compliance and Legal Review `[BLOCKER]`
- [ ] Engage a Kenyan tax consultant to review the proposed tax calendar
- [ ] Confirm payroll deduction rules: PAYE bands, NSSF tiers, SHIF rates, Housing Levy
- [ ] Confirm eTIMS workflow requirements from KRA documentation
- [ ] Review data protection obligations under Kenya Data Protection Act
- [ ] Confirm ODPC registration requirements
- [ ] Draft data processing agreement template for accounting firm clients
- [ ] Engage a lawyer to review privacy policy and terms of service drafts

### 1.5 Pricing Validation
- [ ] Share 4-plan pricing model with 5 bookkeepers
- [ ] Share pricing with 5 SME owners
- [ ] Confirm willingness to pay at each tier
- [ ] Confirm billing preference: monthly vs. annual
- [ ] Confirm per-client vs. flat-fee preference

### 1.6 Competitive Analysis `[PARALLEL]`
- [ ] List all accounting software currently used in Kenya (QuickBooks, Sage, Wave, etc.)
- [ ] Document gaps in each competitor relevant to Kenya compliance
- [ ] Confirm no competitor owns the multi-client bookkeeper dashboard space well
- [ ] Define 3 clear differentiators to lead with in marketing

### 1.7 Discovery Deliverables
- [ ] Write discovery findings report
- [ ] Finalise feature priority list based on interview findings
- [ ] Confirm MVP scope with at least 2 potential pilot firms
- [ ] Get written commitment from 2 accounting firms to pilot the product

---

## Phase 2: Architecture and Project Setup
**Goal:** Set up the full technical foundation before building features.
**Target duration:** 2–3 weeks

### 2.1 Project Decisions `[BLOCKER]`
- [ ] Choose frontend framework: Next.js (recommended)
- [ ] Choose backend framework: NestJS or FastAPI
- [ ] Choose database: PostgreSQL
- [ ] Choose object storage: AWS S3 / Cloudflare R2 / DigitalOcean Spaces
- [ ] Choose cache/queue layer: Redis
- [ ] Choose hosting provider (cloud region preference: Africa/EU for data residency)
- [ ] Choose email provider for transactional emails
- [ ] Choose SMS provider (Africa's Talking recommended for Kenya)
- [ ] Define monorepo vs. separate repos strategy
- [ ] Define staging vs. production environment strategy

### 2.2 Repository Setup
- [ ] Create Git repository with branch protection rules
- [ ] Set up monorepo structure: `/apps/web`, `/apps/api`, `/packages/shared`
- [ ] Add `.gitignore`, `README.md`, `CONTRIBUTING.md`
- [ ] Set up environment variable management (`.env.example` files)
- [ ] Configure linting: ESLint + Prettier (frontend), equivalent for backend
- [ ] Configure pre-commit hooks

### 2.3 Infrastructure Setup
- [ ] Provision development database (PostgreSQL)
- [ ] Provision staging database
- [ ] Set up object storage bucket (dev and staging)
- [ ] Set up Redis instance
- [ ] Configure CI/CD pipeline (GitHub Actions or equivalent)
- [ ] Set up automated database backups
- [ ] Set up error monitoring (Sentry or equivalent)
- [ ] Set up application performance monitoring
- [ ] Set up log aggregation

### 2.4 Database Schema Design `[BLOCKER]`
- [ ] Design multi-tenant schema (firms → client companies → users)
- [ ] Design roles and permissions tables
- [ ] Design chart of accounts schema
- [ ] Design contacts schema (customers and suppliers)
- [ ] Design transactions schema (double-entry bookkeeping)
- [ ] Design documents schema (metadata + storage reference)
- [ ] Design bank accounts and statements schema
- [ ] Design M-Pesa statements schema
- [ ] Design payroll schema (employees, runs, payslips)
- [ ] Design compliance calendar schema
- [ ] Design audit log schema
- [ ] Design notifications schema
- [ ] Design tasks schema
- [ ] Review schema with a database architect or senior developer
- [ ] Write and run initial migrations

### 2.5 API Design
- [ ] Define REST API conventions (versioning, error format, pagination)
- [ ] Document all endpoints in OpenAPI/Swagger spec before building
- [ ] Define authentication strategy: JWT + refresh tokens
- [ ] Define multi-tenancy strategy in API layer (tenant ID scoping)
- [ ] Define file upload API (direct upload vs. presigned URL)

### 2.6 Security Baseline `[BLOCKER]`
- [ ] Implement row-level security / tenant isolation at database layer
- [ ] Set up HTTPS everywhere (dev included)
- [ ] Implement rate limiting on all public endpoints
- [ ] Implement input validation and sanitisation layer
- [ ] Set up CORS policy
- [ ] Plan two-factor authentication implementation (TOTP)
- [ ] Define password hashing strategy (bcrypt/argon2)

### 2.7 PWA Setup
- [ ] Configure Next.js with PWA plugin
- [ ] Create `manifest.json` with app name, icons, and theme colour
- [ ] Implement service worker for offline support
- [ ] Test "Add to Home Screen" on Android and iOS
- [ ] Set up push notification infrastructure

---

## Phase 3: MVP Build — Core Foundation
**Goal:** Build the skeleton every other feature depends on.
**Target duration:** 4–6 weeks

### 3.1 Authentication and User Management `[BLOCKER]`
- [ ] User registration
- [ ] Email verification
- [ ] Login with JWT
- [ ] Logout and session invalidation
- [ ] Password reset via email
- [ ] Two-factor authentication (TOTP)
- [ ] Remember device option
- [ ] Login history table
- [ ] Failed login lockout

### 3.2 Firm Portal Setup `[BLOCKER]`
- [ ] Firm registration flow
- [ ] Firm profile form: name, logo, brand colours, contact details
- [ ] Custom subdomain provisioning (e.g. `firm.ledgerpilot.co.ke`)
- [ ] Firm dashboard (empty state and populated state)
- [ ] Firm settings page

### 3.3 Staff Management
- [ ] Invite staff by email
- [ ] Assign role to staff member
- [ ] Edit staff role
- [ ] Deactivate staff member
- [ ] Staff list view with roles and status
- [ ] Staff activity log view

### 3.4 Role-Based Access Control `[BLOCKER]`
- [ ] Define all 10 roles and their permission sets
- [ ] Implement permission middleware on all API endpoints
- [ ] Implement frontend permission guards (hide/show UI elements by role)
- [ ] Test all role combinations

### 3.5 Client Company Management `[BLOCKER]`
- [ ] Add new client company form (all profile fields)
- [ ] Assign bookkeeper and reviewer to client
- [ ] Client company list with status indicators
- [ ] Client company profile page
- [ ] Client invitation link generation and email
- [ ] Client onboarding flow (client accepts invite, sets password, completes profile)
- [ ] Client company health score calculation (basic version)
- [ ] Archive/deactivate client company

### 3.6 Audit Trail `[BLOCKER]`
- [ ] Implement audit log middleware that captures every write operation
- [ ] Store: user, action, timestamp, before value, after value, reason, entity reference
- [ ] Audit log viewer (filterable by user, date, entity type)
- [ ] Ensure audit logs cannot be deleted

---

## Phase 4: MVP Build — Bookkeeping Engine
**Goal:** Build the core accounting features.
**Target duration:** 6–8 weeks

### 4.1 Chart of Accounts
- [ ] Default Kenya SME chart of accounts seeded on company creation
- [ ] Industry template selector during onboarding
- [ ] Account list view with type, code, name, balance
- [ ] Add custom account
- [ ] Edit account name and code
- [ ] Deactivate account (prevent use in new transactions)
- [ ] Account activity drill-down view

### 4.2 Journal Entries
- [ ] Manual journal entry form (debit/credit lines, date, reference, narration)
- [ ] Validation: debits must equal credits before saving
- [ ] Recurring journal setup (frequency, next run date, auto or manual trigger)
- [ ] Journal entry list with status
- [ ] Reviewer approval for journal entries
- [ ] Reversal entry (no silent deletion)
- [ ] Locked period enforcement (block posting to closed months)

### 4.3 Sales and Receivables
- [ ] Customer database: add, edit, list, search
- [ ] Customer fields: name, PIN, email, phone, address, payment terms
- [ ] Sales invoice creation: line items, tax, discount, due date
- [ ] Proforma invoice
- [ ] Quotation
- [ ] Credit note linked to original invoice
- [ ] Mark invoice as paid (full and partial)
- [ ] Customer statement generation
- [ ] Invoice PDF generation
- [ ] Invoice email to customer
- [ ] Debtors aging report (0–30, 31–60, 61–90, 90+ days)
- [ ] VAT output summary
- [ ] Invoice list with status filter (draft, sent, partially paid, paid, overdue)

### 4.4 Purchases and Payables
- [ ] Supplier database: add, edit, list, search
- [ ] Supplier fields: name, PIN, email, phone, address, WHT flag
- [ ] Supplier bill entry form
- [ ] Purchase order
- [ ] Expense claim
- [ ] Duplicate bill detection (same supplier, same amount, same date range)
- [ ] Supplier bill approval workflow
- [ ] Mark bill as paid (full and partial)
- [ ] Supplier statement view
- [ ] Creditors aging report (0–30, 31–60, 61–90, 90+ days)
- [ ] VAT input summary
- [ ] eTIMS support status field on every bill
- [ ] WHT calculation flag

### 4.5 Document Collection Hub
- [ ] File upload component (drag-and-drop + file picker)
- [ ] Mobile photo capture (PWA camera API)
- [ ] Supported file types: PDF, JPG, PNG, HEIC, XLS, XLSX, CSV
- [ ] File size limit and validation
- [ ] Document metadata form: type, date, supplier/customer, amount, category
- [ ] Document list with status badges
- [ ] Link document to a transaction, bill, or invoice
- [ ] Document status workflow (Uploaded → Needs review → Matched → Posted)
- [ ] Duplicate document detection (hash-based)
- [ ] Document viewer (PDF and image inline preview)
- [ ] Bulk upload
- [ ] Email forwarding address per company (inbound email parsing)
- [ ] Missing document report per client

### 4.6 Bank and M-Pesa Reconciliation
- [ ] Bank account registration per company
- [ ] Bank statement CSV/XLS import (with column mapper for different bank formats)
- [ ] M-Pesa statement import (standard Safaricom export format)
- [ ] Transaction list view with match status
- [ ] Match transaction to invoice/bill/payment manually
- [ ] Auto-categorisation rules engine (narration → account mapping)
- [ ] Create rule from transaction (one-click)
- [ ] Split transaction into multiple lines
- [ ] Transfer matching (between two company accounts)
- [ ] Suspense account workflow (unmatched items go to suspense)
- [ ] Bank reconciliation report (closing balance match)
- [ ] Reconciliation dashboard per account
- [ ] Unreconciled items list
- [ ] Bulk posting of categorised transactions

---

## Phase 5: MVP Build — Compliance and Reporting
**Goal:** Deliver the compliance calendar, close workflow, and management reports.
**Target duration:** 4–5 weeks

### 5.1 Kenya Tax Compliance Calendar
- [ ] Tax obligation setup per company (VAT, PAYE, NSSF, SHA, Housing Levy, etc.)
- [ ] Calendar view showing all obligations across all clients
- [ ] Per-client obligation list with due dates
- [ ] Deadline escalation logic (14 days, 7 days, 3 days, 1 day, overdue)
- [ ] Obligation status: upcoming / in preparation / filed / paid / overdue
- [ ] Assign obligation to staff member
- [ ] Attach filing evidence (screenshot, PDF)
- [ ] Attach payment evidence
- [ ] Client notification when filing is complete
- [ ] Firm-wide compliance calendar (all clients, all obligations)
- [ ] Overdue obligation alert on firm dashboard

### 5.2 Monthly Close Workflow
- [ ] Monthly close checklist per company per month
- [ ] Checklist item statuses: not started / in progress / waiting / done
- [ ] Assign checklist items to staff
- [ ] Comment/note per checklist item
- [ ] Month lock (prevents further posting when close is complete)
- [ ] Month reopen (with reason required, audit logged)
- [ ] Close status visible on firm dashboard per client
- [ ] Clients with incomplete close filter

### 5.3 eTIMS Discipline Module
- [ ] eTIMS status field per company (not started / in progress / active)
- [ ] eTIMS reference field on every sales invoice
- [ ] eTIMS reference field on every supplier bill
- [ ] Supplier PIN field on every bill
- [ ] Risk flag engine: flag bills missing PIN, missing reference, outside period
- [ ] eTIMS risk report (list of flagged documents)
- [ ] Expense deductibility risk report
- [ ] Missing electronic tax invoice report

### 5.4 Management Reports
- [ ] Profit and loss (monthly, quarterly, annual; comparative periods)
- [ ] Balance sheet (as at any date)
- [ ] Trial balance
- [ ] General ledger (filterable by account, date range)
- [ ] Cashflow summary (simplified indirect method)
- [ ] Sales report (by customer, by item, by period)
- [ ] Expense report (by category, by supplier, by period)
- [ ] Payroll summary report
- [ ] VAT summary (input, output, net payable)
- [ ] Bank reconciliation report
- [ ] Debtors aging (already built in 4.3)
- [ ] Creditors aging (already built in 4.4)
- [ ] Tax obligation report
- [ ] Missing documents report

### 5.5 PDF and Excel Exports
- [ ] PDF export for all reports
- [ ] Excel export for all reports
- [ ] PDF invoice (branded with company logo)
- [ ] PDF customer statement
- [ ] PDF payslip
- [ ] PDF management pack (combined monthly report bundle)
- [ ] Export history log (who exported what and when)

### 5.6 Owner-Friendly Dashboard
- [ ] Cash in bank widget
- [ ] M-Pesa balance widget
- [ ] Sales this month widget
- [ ] Expenses this month widget
- [ ] Profit estimate widget
- [ ] Customers owing money widget (total + link to aging)
- [ ] Suppliers to pay widget (total + link to aging)
- [ ] Tax due soon widget
- [ ] Documents missing widget
- [ ] Payroll cost widget
- [ ] Top 5 expenses chart
- [ ] Top 5 customers by revenue chart
- [ ] All widgets respond to selected company and date range

---

## Phase 6: MVP Build — Communication and Tasks
**Goal:** Close the loop between bookkeepers and clients.
**Target duration:** 2–3 weeks

### 6.1 Task Management
- [ ] Create task (title, description, due date, assignee, priority)
- [ ] Assign task to bookkeeper or client
- [ ] Task list view (my tasks, team tasks, client tasks)
- [ ] Task status: open / in progress / waiting / done
- [ ] Comment thread on each task
- [ ] Task due date reminders
- [ ] Document request task type (generates shareable upload link)
- [ ] Link task to a client company, transaction, or compliance item

### 6.2 Notifications
- [ ] In-app notification centre
- [ ] Email notifications for: task assigned, document requested, deadline approaching, month close due, approval required
- [ ] Notification preferences (per user)
- [ ] Mark as read / mark all as read
- [ ] Notification count badge on dashboard

### 6.3 Client Communication Templates
- [ ] Editable email/message templates per firm
- [ ] Monthly document request template
- [ ] Tax deadline reminder template
- [ ] Overdue invoice reminder template (for client's customers)
- [ ] Month close complete notification template
- [ ] Payslip delivery template
- [ ] WhatsApp-friendly plain-text version of each template
- [ ] Bulk send to multiple clients

---

## Phase 7: MVP Polish and Launch Readiness
**Goal:** Make the product robust and ready for pilot firms.
**Target duration:** 3–4 weeks

### 7.1 UI/UX Polish
- [ ] Consistent design system across all pages (spacing, colour, typography)
- [ ] Empty states for every list (no clients, no documents, no transactions)
- [ ] Loading states and skeleton screens
- [ ] Error states and friendly error messages
- [ ] Responsive layout tested on: desktop (1440px), laptop (1280px), tablet (768px), mobile (375px)
- [ ] PWA install prompt tested on Android Chrome and iOS Safari
- [ ] Keyboard navigation and accessibility review (WCAG 2.1 AA minimum)

### 7.2 Performance
- [ ] Page load time under 3 seconds on a standard Kenya mobile connection
- [ ] Database query optimisation (indexes on all foreign keys and filter columns)
- [ ] Image and document lazy loading
- [ ] Pagination on all large lists (transactions, documents, audit logs)
- [ ] Background job processing for heavy tasks (PDF generation, report calculation)

### 7.3 Testing
- [ ] Unit tests for all payroll calculation logic
- [ ] Unit tests for all tax calendar date logic
- [ ] Unit tests for reconciliation matching logic
- [ ] Integration tests for authentication flows
- [ ] Integration tests for document upload and linking
- [ ] End-to-end test: full monthly close workflow
- [ ] End-to-end test: invoice → payment → reconciliation
- [ ] End-to-end test: firm onboarding → client onboarding → first transaction
- [ ] Cross-browser testing: Chrome, Firefox, Safari, Edge
- [ ] Mobile browser testing: Chrome Android, Safari iOS

### 7.4 Security Hardening `[BLOCKER]`
- [ ] Penetration test or security audit on authentication and tenant isolation
- [ ] Review all file upload paths for malware injection risk
- [ ] Confirm no PII leaks in error messages or logs
- [ ] Review all API responses for over-sharing of tenant data
- [ ] Enable Content Security Policy headers
- [ ] Enable HSTS
- [ ] Confirm all secrets are in environment variables, not code

### 7.5 Legal and Compliance `[BLOCKER]`
- [ ] Finalise and publish privacy policy
- [ ] Finalise and publish terms of service
- [ ] Finalise data processing agreement template
- [ ] Confirm payroll rates have been reviewed by a tax consultant
- [ ] Confirm tax calendar dates have been reviewed by a tax consultant
- [ ] Register with ODPC if required before launch

### 7.6 Onboarding Experience
- [ ] Firm onboarding wizard (step 1: profile, step 2: logo, step 3: add first client)
- [ ] Client onboarding wizard (step 1: accept invite, step 2: company profile, step 3: upload first document)
- [ ] In-app onboarding checklist (dismissible)
- [ ] Help tooltips on key fields (KRA PIN, eTIMS status, WHT flag)
- [ ] Empty dashboard with guided first-action prompt

---

## Phase 8: Pilot
**Goal:** Run with 2 real accounting firms and 10–30 companies. Fix real problems.
**Target duration:** 6–8 weeks

### 8.1 Pilot Setup
- [ ] Onboard pilot firm 1 (white-glove, hands-on)
- [ ] Onboard pilot firm 2 (more self-service, observe friction points)
- [ ] Data migration support: import existing client chart of accounts and opening balances
- [ ] Weekly check-in calls with each pilot firm (30 minutes)
- [ ] Set up in-app feedback widget (simple thumbs up/down + comment)
- [ ] Set up error alerting (Sentry) with immediate notification to dev team

### 8.2 Pilot Measurement
- [ ] Track: time to onboard each client company
- [ ] Track: document upload completion rate per client
- [ ] Track: monthly close completion date vs. target
- [ ] Track: reconciliation time per statement
- [ ] Track: number of support questions per firm per week
- [ ] Track: features used most and least
- [ ] Track: bugs reported per week

### 8.3 Pilot Fixes (rolling)
- [ ] Fix all critical bugs within 24 hours
- [ ] Fix all UI friction points within 1 week
- [ ] Prioritise and fix most-requested features in 2-week sprints
- [ ] Retest payroll and tax calendar accuracy with pilot accountants
- [ ] Update chart of accounts templates based on pilot feedback
- [ ] Update compliance calendar dates if errors found

### 8.4 Pilot Exit Criteria
- [ ] At least 2 firms have completed a full monthly close for at least 5 clients
- [ ] Net Promoter Score (NPS) of 7+ from pilot users
- [ ] Zero critical security issues open
- [ ] All payroll calculations verified as correct by pilot accountants
- [ ] All tax calendar dates verified by pilot accountants
- [ ] Monthly close workflow works without needing manual workarounds

---

## Phase 9: Public Launch
**Goal:** Open to paying customers.
**Target duration:** 3–4 weeks

### 9.1 Billing and Subscriptions
- [ ] Choose payment provider (Stripe + Africa's Talking / Flutterwave for M-Pesa)
- [ ] Implement subscription plans (Solo, Firm, Professional, Enterprise)
- [ ] Free trial period (14 or 30 days)
- [ ] Upgrade/downgrade flow
- [ ] Invoice generation for subscription billing
- [ ] Failed payment handling and grace period
- [ ] Cancellation flow with data export option
- [ ] Billing dashboard per firm (invoices, payment method, plan details)

### 9.2 White-Label Customisation
- [ ] Custom subdomain provisioning (automated)
- [ ] Custom domain support with SSL (CNAME instructions)
- [ ] Logo and colour picker for firm branding
- [ ] Branded login page per firm
- [ ] Branded email templates per firm (from address, logo, colours)
- [ ] Branded PDF reports

### 9.3 Marketing and Acquisition
- [ ] Launch landing page (what it does, who it's for, pricing, testimonials)
- [ ] Sign-up flow with free trial
- [ ] Launch blog post: "Why Kenya bookkeepers need a compliance-first tool"
- [ ] LinkedIn and Twitter/X launch posts
- [ ] WhatsApp group outreach to accountant communities
- [ ] Partner with ICPAK or Kenya accountant associations for awareness
- [ ] Google Ads targeting: "bookkeeping software Kenya", "eTIMS compliance tool"

### 9.4 Support Infrastructure
- [ ] Help centre with written guides for every major workflow
- [ ] Video walkthroughs: firm onboarding, client onboarding, monthly close, reconciliation
- [ ] In-app chat support (Crisp, Intercom, or Tawk.to)
- [ ] Support email queue
- [ ] Bug report form
- [ ] Status page for uptime

### 9.5 Partner and Referral Programme
- [ ] Accountant partner programme (commission or revenue share)
- [ ] Referral link generation per firm
- [ ] Referral tracking and rewards
- [ ] Partner onboarding guide

---

## Phase 10: Version 2 — Automation Layer
**Goal:** Add intelligence and automation to save bookkeepers more time.
**Target duration:** 8–12 weeks

### 10.1 OCR and Document Intelligence
- [ ] Integrate OCR service (Google Document AI, AWS Textract, or Mindee)
- [ ] Auto-extract from supplier invoices: supplier name, PIN, date, invoice number, amount, VAT
- [ ] Auto-extract from receipts: merchant, date, amount
- [ ] Auto-extract from bank statements (fallback for non-standard formats)
- [ ] Show extracted fields to bookkeeper for confirmation before posting
- [ ] Confidence score per extracted field
- [ ] Improve extraction accuracy over time using confirmed corrections

### 10.2 AI Categorisation Assistant
- [ ] Train categorisation model on confirmed transactions
- [ ] Suggest account category on every uncategorised transaction
- [ ] Show top 3 suggestions with confidence score
- [ ] One-click accept suggestion
- [ ] AI-suggested bank rules (learn from accepted categorisations)
- [ ] Bulk accept AI suggestions with review step
- [ ] Monthly AI suggestion acceptance rate metric

### 10.3 AI Bookkeeping Assistant (Chat)
- [ ] AI chat widget in client workspace
- [ ] Commands: "summarise this month's performance", "what documents are missing", "explain the VAT movement"
- [ ] Draft client reminder message on demand
- [ ] Generate management commentary for reports
- [ ] Flag unusual transactions with plain-English explanation
- [ ] All AI outputs require human review before any action is taken
- [ ] AI audit log (what was suggested, what was accepted, when)

### 10.4 Full Payroll Engine
- [ ] Configurable payroll rules engine (not hard-coded rates)
- [ ] PAYE calculation (monthly bands, personal relief, insurance relief)
- [ ] NSSF calculation (Tier 1 and Tier 2)
- [ ] SHIF/SHA calculation
- [ ] Affordable Housing Levy calculation
- [ ] Multiple allowances and benefits (configurable per employee)
- [ ] Overtime calculation
- [ ] Leave days and deduction
- [ ] Loan/advance deduction tracking
- [ ] Payslip generation (PDF)
- [ ] Payslip bulk email to employees
- [ ] PAYE summary export (for iTax upload)
- [ ] NSSF contribution export
- [ ] SHIF/SHA contribution export
- [ ] Housing Levy export
- [ ] Payroll journal auto-post to general ledger
- [ ] Payroll approval workflow (payroll officer → reviewer → firm owner)
- [ ] Payroll lock after approval
- [ ] Historical payroll archive

### 10.5 WhatsApp Integration
- [ ] WhatsApp Business API setup (Meta partner or reseller)
- [ ] Send document request via WhatsApp
- [ ] Client can reply with photo of receipt (auto-ingested to document hub)
- [ ] Send tax deadline reminders via WhatsApp
- [ ] Send monthly close request via WhatsApp
- [ ] Send payslip via WhatsApp (encrypted/password-protected PDF)
- [ ] WhatsApp message log per client

### 10.6 Email Ingestion
- [ ] Unique email address per company (e.g. `company@docs.ledgerpilot.co.ke`)
- [ ] Parse incoming emails for attachments (PDFs, images)
- [ ] Auto-add attachments to document hub with Needs Review status
- [ ] Extract sender name, date, and subject as document metadata
- [ ] Notify bookkeeper of new inbound documents

### 10.7 Advanced Bank Rules
- [ ] Rules manager UI: list, add, edit, delete rules
- [ ] Rule conditions: narration contains, amount greater/less than, account name
- [ ] Rule actions: assign account, assign supplier/customer, assign category, split
- [ ] Rule priority ordering
- [ ] Bulk apply rules to historical unmatched transactions
- [ ] Rule effectiveness report (how many transactions auto-categorised per rule)

### 10.8 Approval Workflows
- [ ] Configurable approval chains per document type
- [ ] Multi-step approval: bookkeeper → senior accountant → client
- [ ] Approval with comment
- [ ] Rejection with reason required
- [ ] Escalation if approval not completed within X hours
- [ ] Approval history on every document and transaction

### 10.9 Budgeting and Forecasting
- [ ] Annual budget entry by account
- [ ] Monthly budget breakdown
- [ ] Budget vs. actual report (profit and loss)
- [ ] Variance analysis (amount and percentage)
- [ ] Cashflow forecast based on known receivables and payables

### 10.10 Recurring Invoices and Bills
- [ ] Set up recurring invoice (frequency, start date, end date or indefinite)
- [ ] Auto-generate invoice on schedule
- [ ] Notify bookkeeper to review before sending
- [ ] Recurring bill (rent, utilities, retainers)
- [ ] Recurring expense journal

---

## Phase 11: Version 3 — Platform Expansion
**Goal:** Expand into a platform with third-party integrations, marketplace, and advanced modules.
**Target duration:** Ongoing

### 11.1 Fixed Asset Register
- [ ] Asset database: name, category, purchase date, cost, useful life, residual value
- [ ] Depreciation methods: straight-line, reducing balance
- [ ] Monthly depreciation schedule
- [ ] Depreciation journal auto-post
- [ ] Asset disposal workflow
- [ ] Asset register report

### 11.2 Inventory Module
- [ ] Item/product database with unit cost and selling price
- [ ] Stock-in (purchase order / supplier bill)
- [ ] Stock-out (sales invoice)
- [ ] Stock adjustment with reason
- [ ] Valuation methods: FIFO, weighted average
- [ ] Stock on hand report
- [ ] Low stock alert
- [ ] Inventory valuation report

### 11.3 Multi-Branch and Group Reporting
- [ ] Branch tagging on all transactions
- [ ] Branch profit and loss
- [ ] Branch balance sheet
- [ ] Intercompany transaction support
- [ ] Group consolidation report

### 11.4 Public API
- [ ] API key management per firm
- [ ] Scoped permissions per API key
- [ ] Rate limiting per key
- [ ] Webhooks for key events (new document, close complete, payment received)
- [ ] API documentation site
- [ ] Sandbox environment for developers

### 11.5 Accountant/Bookkeeper Marketplace
- [ ] Public directory of firms using the platform
- [ ] Firm profile page (services, specialisms, counties covered, contact)
- [ ] SME can request to be matched with a bookkeeper
- [ ] Lead routing to firms
- [ ] Review and rating system

### 11.6 Loan-Readiness Report
- [ ] Compile: 12-month profit and loss, balance sheet, cashflow summary, debtors aging
- [ ] One-click "loan readiness pack" PDF
- [ ] Summary scorecard (profitable?, positive cashflow?, low debt ratio?)
- [ ] Shareable link to lender

### 11.7 Audit Collaboration Portal
- [ ] Invite external auditor with read-only access
- [ ] Auditor request list (PBC list)
- [ ] Auditor notes and queries
- [ ] Response and evidence attachment
- [ ] Audit query status tracking

### 11.8 Credit Control Automation
- [ ] Automated overdue invoice reminders (email + WhatsApp) on schedule
- [ ] Escalation: first reminder, second reminder, final notice
- [ ] Stop credit flag per customer
- [ ] Dunning workflow configuration per firm
- [ ] Collection rate metric

### 11.9 Supplier Payment Scheduling
- [ ] Payment run creation: select bills due for payment
- [ ] Approval of payment run
- [ ] Payment file export (bank transfer format)
- [ ] Mark payments as processed
- [ ] Payment run history

### 11.10 Advanced Analytics and Benchmarking
- [ ] Industry benchmarks (average profit margin, expense ratios by sector)
- [ ] Client performance vs. industry average
- [ ] Bookkeeper productivity metrics (closes per month, time per client)
- [ ] Firm revenue forecast

---

## Ongoing: Infrastructure and Operations

### Security (Continuous)
- [ ] Monthly dependency vulnerability scan
- [ ] Quarterly penetration test
- [ ] Annual security review
- [ ] Monitor for unusual login patterns
- [ ] Review access permissions quarterly

### Compliance (Continuous)
- [ ] Update payroll rates when KRA/NSSF/SHIF/Housing Levy rules change
- [ ] Update tax calendar when KRA changes filing dates
- [ ] Monitor eTIMS regulation changes
- [ ] Review privacy policy annually
- [ ] Review data retention schedules annually

### Performance (Continuous)
- [ ] Database query review monthly
- [ ] Scale infrastructure as user count grows
- [ ] CDN and caching review quarterly

### Customer Success (Continuous)
- [ ] Monthly webinar for new features
- [ ] Quarterly satisfaction survey
- [ ] Annual firm review (usage, value, expansion)
- [ ] Track churn reasons and act on patterns

---

## Summary Checklist by Phase

| Phase | Description | Est. Duration |
|---|---|---|
| Phase 1 | Discovery and Validation | 3–4 weeks |
| Phase 2 | Architecture and Project Setup | 2–3 weeks |
| Phase 3 | MVP Core Foundation | 4–6 weeks |
| Phase 4 | MVP Bookkeeping Engine | 6–8 weeks |
| Phase 5 | MVP Compliance and Reporting | 4–5 weeks |
| Phase 6 | MVP Communication and Tasks | 2–3 weeks |
| Phase 7 | MVP Polish and Launch Readiness | 3–4 weeks |
| Phase 8 | Pilot | 6–8 weeks |
| Phase 9 | Public Launch | 3–4 weeks |
| Phase 10 | Version 2 — Automation Layer | 8–12 weeks |
| Phase 11 | Version 3 — Platform Expansion | Ongoing |

**Total to Public Launch (Phases 1–9):** approximately 10–14 months with a small focused team.

---

*Last updated: June 2026*

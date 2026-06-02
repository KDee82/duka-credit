# LedgerPilot Kenya — Full Product Specification

> Kenya White-Label Accounting & Bookkeeping Web App

---

## Table of Contents

1. [Product Name](#1-product-name)
2. [Product Vision](#2-product-vision)
3. [Core Problem](#3-core-problem)
4. [Target Users](#4-target-users)
5. [Product Positioning](#5-product-positioning)
6. [Core Product Modules](#6-core-product-modules)
   - 6.1 [Multi-Tenant White-Label Firm Portal](#61-multi-tenant-white-label-firm-portal)
   - 6.2 [Client Company Workspace](#62-client-company-workspace)
   - 6.3 [Document Collection Hub](#63-document-collection-hub)
   - 6.4 [eTIMS Discipline and Invoice Validation Workflow](#64-etims-discipline-and-invoice-validation-workflow)
   - 6.5 [Chart of Accounts and General Ledger](#65-chart-of-accounts-and-general-ledger)
   - 6.6 [Sales and Receivables](#66-sales-and-receivables)
   - 6.7 [Purchases and Payables](#67-purchases-and-payables)
   - 6.8 [Bank and M-Pesa Reconciliation](#68-bank-and-m-pesa-reconciliation)
   - 6.9 [Payroll and Statutory Deductions](#69-payroll-and-statutory-deductions)
   - 6.10 [Kenya Tax Calendar and Compliance Engine](#610-kenya-tax-calendar-and-compliance-engine)
   - 6.11 [Month-End Close Workflow](#611-month-end-close-workflow)
   - 6.12 [Management Reports](#612-management-reports)
   - 6.13 [Client Communication and Task Management](#613-client-communication-and-task-management)
   - 6.14 [AI Bookkeeping Assistant](#614-ai-bookkeeping-assistant)
   - 6.15 [Audit Trail and Controls](#615-audit-trail-and-controls)
   - 6.16 [Data Protection and Security](#616-data-protection-and-security)
7. [Web App and Installation Model](#7-web-app-and-installation-model)
8. [Suggested Technology Architecture](#8-suggested-technology-architecture)
9. [Data Model Overview](#9-data-model-overview)
10. [Main User Journeys](#10-main-user-journeys)
11. [MVP Scope](#11-mvp-scope)
12. [Version 2 Scope](#12-version-2-scope)
13. [Version 3 Scope](#13-version-3-scope)
14. [Pricing Model](#14-pricing-model)
15. [Revenue Opportunities](#15-revenue-opportunities)
16. [Competitive Advantage](#16-competitive-advantage)
17. [Success Metrics](#17-success-metrics)
18. [Risk Areas](#18-risk-areas)
19. [Recommended Build Roadmap](#19-recommended-build-roadmap)
20. [Final Product Statement](#20-final-product-statement)

---

## 1. Product Name

**Working name:** LedgerPilot Kenya

**Alternative brandable names:**
- BooksFlow Kenya
- PesaLedger
- TaxReady Books
- ClerkDesk
- FirmBooks

The platform should be built as a white-label accounting operations system for Kenyan bookkeepers, accounting firms, SMEs, schools, clinics, shops, distributors, service businesses, NGOs, and growing companies that need clean books, tax-ready records, eTIMS discipline, payroll compliance, and management reports.

---

## 2. Product Vision

To create a Kenya-first bookkeeping and accounting platform that helps companies and bookkeepers move from messy manual records, WhatsApp receipts, Excel files, late tax preparation, missing invoices, and poor client communication into a structured, auditable, tax-ready, real-time finance workflow.

The app should not try to be "just another accounting software." Its strongest position should be:

> **A compliance-first bookkeeping command centre for Kenya, built for bookkeepers managing many client companies.**

---

## 3. Core Problem

Many Kenyan SMEs and bookkeepers face the same recurring issues:

1. Documents are scattered across WhatsApp, email, M-Pesa messages, bank statements, till statements, receipts, invoices, Excel sheets, and paper files.
2. Business owners often delay sending records until the tax deadline is near.
3. Bookkeepers spend too much time chasing documents instead of advising clients.
4. eTIMS requirements make invoice discipline more important, but many businesses still do invoicing and expense support poorly.
5. Expenses without proper electronic tax invoices can create tax deductibility problems.
6. VAT, PAYE, NSSF, SHIF/SHA, Housing Levy, withholding tax, instalment tax, turnover tax, and annual returns require a strong calendar and reminder system.
7. Payroll is often handled separately from accounting, causing mismatches between salaries, PAYE, statutory deductions, and the general ledger.
8. Bookkeepers serving multiple clients lack one dashboard to see which client is late, which return is due, which bank reconciliation is incomplete, and which documents are missing.
9. Owners want simple business answers: cash position, sales, debtors, creditors, profit, tax exposure, payroll cost, and which customers owe money.
10. Audit trails are weak — many SMEs cannot easily explain who changed a transaction, when, and why.

---

## 4. Target Users

### 4.1 Accounting Firms and Bookkeepers

These are the **primary target users**.

They need:
- Multi-client management
- Client onboarding
- Document collection
- Monthly close workflows
- Tax calendars
- Staff assignment
- Client communication
- Review and approval workflows
- White-label branding
- Reports that can be shared with business owners

### 4.2 SMEs and Business Owners

They need:
- Simple invoicing
- Receipt upload
- Expense tracking
- Cashflow view
- Sales and profit reports
- Tax reminders
- M-Pesa/bank import
- Debtor tracking
- Payroll summary
- Easy collaboration with their accountant

### 4.3 Internal Finance Teams

They need:
- Role-based access
- Approval workflows
- Department/project tracking
- Payroll integration
- Management reports
- Audit trails
- Document storage
- Month-end close checklists

### 4.4 Sector-Specific Users

The system should support vertical templates for:
- Retail shops
- Schools
- Clinics
- Restaurants
- Construction contractors
- Professional service firms
- NGOs and churches
- E-commerce businesses
- Importers and distributors
- Landlords/property managers

---

## 5. Product Positioning

> **"A Kenya-first white-label bookkeeping and compliance platform for accountants, bookkeepers, and SMEs."**

The unique edge is not only bookkeeping. It is the combination of:
- Kenya tax calendar
- eTIMS document discipline
- Multi-client accountant dashboard
- Payroll and statutory compliance workflow
- Document collection automation
- WhatsApp-friendly owner experience
- Audit-ready books
- Management reporting
- White-label deployment for firms

---

## 6. Core Product Modules

### 6.1 Multi-Tenant White-Label Firm Portal

Accounting firms should be able to create their own branded workspace.

**Features**
- Custom firm name
- Logo upload
- Brand colours
- Custom subdomain (e.g. `clients.accountingfirm.co.ke`)
- Optional custom domain
- Firm staff accounts
- Client company accounts
- Role-based permissions
- Client invitation links
- Client status dashboard
- Firm-wide compliance calendar
- Firm-level billing settings

**User Roles**

| Role | Description |
|---|---|
| Firm Owner | Full control of firm workspace |
| Firm Admin | Manage staff, clients, and settings |
| Senior Accountant | Review, approve, and lock periods |
| Bookkeeper | Post transactions, reconcile, close months |
| Payroll Officer | Process payroll and statutory deductions |
| Tax Reviewer | Review and approve tax submissions |
| Client Owner | Upload documents, view reports, approve payroll |
| Client Finance Staff | Upload documents and view limited reports |
| Auditor / Read-only Reviewer | View-only access for audit purposes |
| External Consultant | Scoped access to specific modules |

**Why This Matters**

A solo bookkeeper or accounting firm can manage 10, 50, or 300 clients without mixing files, logins, deadlines, or records.

---

### 6.2 Client Company Workspace

Each client company should have its own workspace.

**Company Profile Fields**
- Business name
- Business registration number
- KRA PIN
- VAT status
- Turnover tax status
- Industry
- County
- Currency
- Financial year-end
- Branches
- Bank accounts
- M-Pesa tills/paybills
- Payroll status
- eTIMS onboarding status
- Tax obligations
- Assigned bookkeeper
- Assigned reviewer

**Company Health Score**

The system should calculate a simple score from 0–100 based on:
- Bank reconciliations completed
- VAT-ready invoices
- Missing receipts
- Payroll processed
- Tax returns due
- Unreconciled transactions
- Unpaid customer invoices
- Overdue supplier bills
- Document upload discipline
- Month-end close status

---

### 6.3 Document Collection Hub

This is one of the most important modules.

**Supported Documents**
- Supplier invoices
- Customer invoices
- Receipts
- Delivery notes
- LPOs
- Bank statements
- M-Pesa statements
- Payroll sheets
- Petty cash sheets
- Import documents
- Withholding tax certificates
- Rent invoices
- Utility bills
- Loan statements
- Asset purchase documents
- Insurance documents
- Statutory payment slips

**Upload Channels**
- Web upload
- Mobile/PWA upload
- Email forwarding
- WhatsApp upload (via business number or integration)
- Bulk upload
- Drag-and-drop
- Scanner upload
- Photo capture

**Document Intelligence**

The system should read documents and suggest:
- Supplier/customer name
- Date
- Invoice number
- PIN (if visible)
- Gross amount
- VAT amount
- Net amount
- Expense category
- Payment method
- Possible duplicate
- Missing eTIMS support
- Whether it relates to a bank/M-Pesa transaction

**Document Statuses**

| Status | Meaning |
|---|---|
| Uploaded | Received but not yet reviewed |
| Needs review | Flagged for bookkeeper action |
| Matched | Linked to a transaction |
| Posted | Entered into the ledger |
| Rejected | Not accepted |
| Duplicate | Already exists in the system |
| Missing required details | Incomplete document |
| Requires eTIMS confirmation | Needs electronic tax invoice validation |
| Archived | Stored for record-keeping |

---

### 6.4 eTIMS Discipline and Invoice Validation Workflow

The app should not pretend to replace KRA systems unless official integrations are available and approved. Instead, it should create a strong workflow around eTIMS readiness.

**Features**
- eTIMS status per company
- eTIMS invoice checklist
- Sales invoice tracker
- Expense invoice tracker
- Supplier invoice compliance flag
- Missing electronic tax invoice report
- Expense deductibility risk report
- KRA validation preparation report
- Invoice QR/reference capture
- Attachment of eTIMS invoice PDF/image
- Supplier PIN capture
- Customer PIN capture
- VAT breakdown
- Credit note/debit note tracking

**eTIMS Risk Flags**

The app should flag:
- Expense without invoice
- Invoice without supplier PIN
- Invoice without eTIMS reference
- Invoice date outside reporting period
- VAT claimed but supplier invoice missing
- Duplicate invoice number
- Mismatch between amount paid and invoice amount
- Supplier invoice not attached
- Large expense lacking support
- Manual invoice used where electronic tax invoice is expected

---

### 6.5 Chart of Accounts and General Ledger

**Features**
- Kenya SME chart of accounts template
- Industry-specific chart templates
- Custom accounts
- Account codes
- Journal entries
- Recurring journals
- Opening balances
- Trial balance
- General ledger
- Account activity history
- Audit trail
- Locked accounting periods
- Reviewer approval before posting

**Industry Templates Available For:**
- Retail
- Service business
- School
- Clinic
- Restaurant
- Property management
- Construction
- NGO
- Professional services
- E-commerce
- Import/distribution

---

### 6.6 Sales and Receivables

**Features**
- Customer database
- Sales invoices
- Proforma invoices
- Quotations
- Credit notes
- Customer statements
- Payment receipts
- Partial payments
- Aging report
- Overdue reminders
- Sales by customer
- Sales by item/service
- Sales by branch
- Sales by salesperson
- VAT output summary
- Invoice attachment/eTIMS reference field

**Customer Reminder Channels**
- Email
- SMS
- WhatsApp link
- Downloadable statement
- Payment instruction note

---

### 6.7 Purchases and Payables

**Features**
- Supplier database
- Supplier bills
- Purchase orders
- Expense claims
- Supplier statements
- Payment tracking
- Aging report
- Supplier PIN field
- WHT applicability flag
- VAT input summary
- eTIMS support status
- Duplicate bill detection
- Approval workflow

**Approval Flow**

```
1. Bill uploaded
2. OCR reads bill
3. Bookkeeper reviews
4. Client owner approves
5. Bill is posted
6. Payment is recorded
7. Reconciliation confirms payment
```

---

### 6.8 Bank and M-Pesa Reconciliation

**Data Sources**
- Bank CSV/XLS uploads
- M-Pesa statement uploads
- Till/paybill exports
- Manual import
- Future bank feed integrations where possible
- Future M-Pesa Daraja integration where appropriate

**Features**
- Statement import
- Auto-categorisation rules
- Match payments to invoices
- Match payments to bills
- Split transactions
- Transfer matching
- Bank charges detection
- M-Pesa charges detection
- Suspense account workflow
- Reconciliation dashboard
- Unreconciled items list
- Rules by narration
- Bulk posting

**Smart Auto-Categorisation Rules (Examples)**

| Narration | Suggested Category |
|---|---|
| Safaricom Post Pay | Telephone expense |
| KPLC | Electricity |
| Rent | Rent expense |
| PAYE | PAYE payable |
| NSSF | NSSF payable |
| SHA / SHIF | Medical statutory payable |
| Housing Levy | Housing levy payable |
| M-Pesa charges | Bank/mobile money charges |

---

### 6.9 Payroll and Statutory Deductions

Payroll should be built carefully because rules change. The app should use a **configurable payroll rules engine**, not hard-coded permanent rates.

**Features**
- Employee database
- KRA PIN
- National ID/passport
- NSSF number
- SHA/SHIF details
- Employment type
- Basic salary
- Allowances and benefits
- Overtime
- Deductions
- Loans/advances
- Leave days
- Payslips
- Payroll journal
- Employer cost report
- PAYE summary
- NSSF summary
- SHIF/SHA contribution summary
- Housing levy summary
- Export files for filing support
- Payroll approval workflow

**Payroll Compliance Calendar**
- PAYE due date reminder
- NSSF due date reminder
- SHA/SHIF contribution reminder
- Housing Levy reminder
- Payroll lock after approval
- Statutory payment slip attachment

---

### 6.10 Kenya Tax Calendar and Compliance Engine

This is a **major differentiator**.

**Supported Obligations**
- VAT
- PAYE
- NSSF
- SHA/SHIF
- Affordable Housing Levy
- Withholding tax
- Turnover tax
- Instalment tax
- Annual income tax return
- Fringe benefit tax (where applicable)
- Digital services-related tax workflows (where applicable)
- Excise-related reminders (where applicable)
- County license reminders
- Business permit renewal reminders
- Audit schedule reminders

**Compliance Dashboard (Per Client)**

| Category | Details |
|---|---|
| Upcoming obligations | What is due soon |
| Filed obligations | What has been submitted |
| Paid obligations | Payment evidence attached |
| Missing support | Documents needed before filing |
| Overdue tasks | Flagged and escalated |
| Assigned staff | Who is responsible |
| Reviewer status | Approval status |
| Client approval required | Pending client sign-off |
| Filing evidence | Attached confirmation |
| Payment evidence | Attached payment confirmation |

**Deadline Escalation Workflow**

| Days to Deadline | Action |
|---|---|
| 14 days | Prepare documents |
| 7 days | Review required |
| 3 days | Client approval required |
| 1 day | Urgent alert |
| Overdue | Overdue flag and escalation |

---

### 6.11 Month-End Close Workflow

The app should guide bookkeepers through a standard monthly close.

**Monthly Close Checklist**
- [ ] Import bank statements
- [ ] Import M-Pesa statements
- [ ] Upload supplier invoices
- [ ] Upload customer invoices
- [ ] Match receipts
- [ ] Reconcile bank accounts
- [ ] Reconcile M-Pesa accounts
- [ ] Review debtors
- [ ] Review creditors
- [ ] Review payroll journal
- [ ] Review VAT control
- [ ] Review PAYE/NSSF/SHA/Housing Levy accounts
- [ ] Post accruals
- [ ] Post depreciation
- [ ] Review suspense account
- [ ] Lock month
- [ ] Generate management pack
- [ ] Send client report

**Close Statuses**

| Status | Meaning |
|---|---|
| Not started | Month not yet opened |
| In progress | Bookkeeper is working |
| Waiting for client | Documents or approvals pending |
| Waiting for reviewer | Sent for senior review |
| Completed | All steps done |
| Locked | Period closed, no further edits |
| Reopened | Unlocked for correction |

---

### 6.12 Management Reports

Business owners need simple, practical reports.

**Core Reports**
- Profit and loss
- Balance sheet
- Cashflow summary
- Trial balance
- General ledger
- Sales report
- Expense report
- VAT summary
- Payroll summary
- Debtors aging
- Creditors aging
- Bank reconciliation report
- Tax obligation report
- Missing documents report
- Expense risk report
- Monthly management pack

**Owner-Friendly Dashboard**

| Metric | Description |
|---|---|
| Cash in bank | Current bank balance |
| M-Pesa balance | Current M-Pesa float |
| Sales this month | Invoiced revenue |
| Expenses this month | Total expenses posted |
| Profit estimate | Revenue minus expenses |
| Customers owing money | Outstanding debtor total |
| Suppliers to pay | Outstanding creditor total |
| Tax due soon | Upcoming compliance deadlines |
| Documents missing | Unresolved document gaps |
| Payroll cost | Total payroll this month |
| Top expenses | Largest expense categories |
| Top customers | Highest revenue customers |

---

### 6.13 Client Communication and Task Management

**Features**
- Client task requests
- Bookkeeper task assignment
- Internal notes
- Client comments
- Document request links
- Automated reminders
- Approval requests
- Deadline notifications
- WhatsApp/email templates
- Evidence requests
- Conversation history per transaction

**Example Automated Message**

> "Hello, please upload your May 2026 M-Pesa statement, bank statement, supplier invoices, and payroll changes by 5 June so we can close your books and prepare tax filings."

---

### 6.14 AI Bookkeeping Assistant

The AI assistant should **support, not replace**, accountant review.

**AI Features**
- Suggest account category
- Detect duplicate documents
- Identify missing support
- Explain report movements
- Draft client reminder messages
- Summarise monthly performance
- Flag unusual transactions
- Suggest bank rules
- Ask client clarification questions
- Generate management commentary

**Guardrails**
- AI suggestions must be reviewed before posting
- Every AI-created entry must have an audit trail
- AI should show a confidence score
- AI should not file taxes automatically
- AI should not override locked periods

---

### 6.15 Audit Trail and Controls

**Controls**
- Role-based permissions
- Maker-checker approval
- Locked periods
- Edit history
- Reversal entries instead of silent deletion
- User activity logs
- Document versioning
- Approval timestamps
- Export history
- Login history
- Two-factor authentication
- Password policies

**Audit Trail Fields**

| Field | Description |
|---|---|
| User | Who made the change |
| Action | What was done |
| Timestamp | When it happened |
| Before value | Original value |
| After value | New value |
| Reason for change | Explanation provided |
| Related document | Linked file or transaction |
| IP/device metadata | Where applicable |

---

### 6.16 Data Protection and Security

The system must be built for sensitive financial and personal data.

**Security Requirements**
- Encryption in transit (TLS)
- Encryption at rest
- Role-based access control
- Two-factor authentication
- Tenant isolation
- Secure backups
- Activity logs
- Data retention settings
- Data deletion workflows
- Secure file storage
- Access reviews
- Strong admin controls

**Data Protection Requirements**
- Privacy policy
- Terms of service
- Data processing agreement for accounting firms
- Consent and lawful-basis records where needed
- Data subject request workflow
- Breach response workflow
- Data retention and disposal policy
- ODPC registration readiness support
- Local legal review before launch

---

## 7. Web App and Installation Model

The product should be a modern web application with PWA installation.

**Technical Form**
- Responsive web app
- Installable PWA
- Works on desktop, tablet, and mobile
- Offline document capture
- Online sync
- Push notifications
- Secure login
- Optional firm-branded domain

**PWA Features**
- Add to home screen
- Upload receipts from phone camera
- Offline queue for documents
- Push deadline reminders
- Fast dashboard access
- Mobile approval requests

---

## 8. Suggested Technology Architecture

### Frontend
- React / Next.js
- Tailwind CSS
- PWA support
- Role-aware dashboards
- Mobile-first document capture

### Backend
- Node.js/NestJS or Django/FastAPI
- PostgreSQL database
- Redis queue/cache
- Object storage for documents
- Background workers
- REST/GraphQL API

### AI and Automation
- OCR service
- Document classification
- Transaction categorisation engine
- Rules engine
- AI assistant layer
- Human approval workflow

### Integrations (Potential)

| Integration | Purpose |
|---|---|
| KRA/eTIMS workflows | Where permitted |
| iTax export support | Filing preparation |
| M-Pesa Daraja | Transaction import |
| Email ingestion | Document collection |
| WhatsApp Business API | Client reminders and uploads |
| Bank statement import | Reconciliation data |
| Payroll export templates | Filing support |
| Google Drive / Dropbox | Document source |
| Excel import/export | Data portability |
| PDF report generation | Client reporting |

---

## 9. Data Model Overview

**Main Tables / Objects**

| Object | Description |
|---|---|
| Firms | Accounting firm workspaces |
| Firm users | Staff within a firm |
| Client companies | Each client's workspace |
| Company users | Client-side users |
| Roles and permissions | Access control rules |
| Chart of accounts | GL account structure |
| Contacts | Shared customer/supplier base |
| Customers | Receivables contacts |
| Suppliers | Payables contacts |
| Items/services | Products and service catalogue |
| Sales invoices | Customer billing |
| Purchase bills | Supplier invoices |
| Payments | Receipts and payments |
| Receipts | Supporting documents |
| Bank accounts | Registered bank accounts |
| Bank statements | Imported statement lines |
| M-Pesa statements | Imported M-Pesa lines |
| Transactions | Posted GL transactions |
| Journal entries | Manual/recurring entries |
| Payroll runs | Monthly payroll batches |
| Employees | Staff records |
| Statutory obligations | Tax/compliance calendar items |
| Tax filings | Filing records and evidence |
| Documents | Uploaded files and metadata |
| Tasks | Bookkeeper and client tasks |
| Comments | Communication threads |
| Audit logs | Change history |
| Reports | Saved/generated reports |
| Notifications | Alerts and reminders |
| Subscription plans | Billing tiers |

---

## 10. Main User Journeys

### 10.1 Accounting Firm Onboarding

1. Firm signs up
2. Adds logo and brand colours
3. Creates staff users
4. Selects subscription plan
5. Adds first client company
6. Assigns bookkeeper and reviewer
7. Sends client invitation
8. Client uploads documents
9. Firm starts bookkeeping workflow

### 10.2 SME Owner Uploads Monthly Records

1. Owner logs into mobile PWA
2. Sees missing document checklist
3. Uploads bank statement
4. Uploads M-Pesa statement
5. Takes photos of receipts
6. Adds sales invoices
7. Confirms payroll changes
8. Submits month for bookkeeping
9. Receives dashboard and reports after review

### 10.3 Bookkeeper Monthly Close

1. Opens firm dashboard
2. Filters clients with incomplete month close
3. Opens client workspace
4. Reviews imported bank/M-Pesa transactions
5. Matches receipts and invoices
6. Posts expenses and sales
7. Reviews VAT summary
8. Checks payroll journal
9. Clears suspense items
10. Sends to reviewer
11. Locks month
12. Sends management pack

### 10.4 Tax Compliance Workflow

1. App identifies obligation due
2. App checks documents required
3. Bookkeeper prepares return data
4. Reviewer approves
5. Filing/payment evidence is attached
6. Status changes to filed/paid
7. Client receives confirmation
8. Records are archived for audit support

---

## 11. MVP Scope

### Must-Have

- White-label firm portal
- Multi-client company management
- User roles
- Document upload and tagging
- Sales invoices
- Purchase bills
- Bank/M-Pesa statement upload
- Manual reconciliation
- Chart of accounts
- Journal entries
- Profit and loss
- Balance sheet
- Debtors aging
- Creditors aging
- Kenya compliance calendar
- Monthly close checklist
- Task reminders
- Client dashboard
- Audit trail
- PDF/Excel exports
- PWA installability

### Nice-to-Have

- OCR extraction
- AI categorisation suggestions
- WhatsApp document request links
- Payroll summary module
- eTIMS support checklist
- VAT summary
- Missing document report

---

## 12. Version 2 Scope

- Full payroll engine
- Advanced AI assistant
- M-Pesa Daraja integration
- Email ingestion
- WhatsApp Business API
- Advanced eTIMS workflow
- Management pack automation
- Bank rules
- Approval workflows
- Industry templates
- ODPC compliance centre
- Subscription billing
- Client portal branding
- Mobile camera receipt scanning
- Recurring invoices
- Recurring expenses
- Budgeting and forecasting

---

## 13. Version 3 Scope

- Marketplace for accountants/bookkeepers
- API for third-party integrations
- Advanced analytics
- Benchmarking by industry
- Loan-readiness reports
- Audit collaboration portal
- Inventory module
- Fixed asset register
- Multi-branch consolidation
- Group reporting
- Advanced cashflow forecasting
- Credit control automation
- Supplier payment scheduling

---

## 14. Pricing Model

### Plan 1: Solo Bookkeeper
For individual bookkeepers.
- Up to 10 clients
- Basic reports
- Document upload
- Compliance calendar
- Monthly close checklist
- Standard branding

### Plan 2: Accounting Firm
For growing firms.
- Up to 50 clients
- Staff roles
- Reviewer workflow
- White-label branding
- Advanced reports
- Task automation
- Client portal

### Plan 3: Professional Firm
For established firms.
- Unlimited or high client limit
- Custom domain
- Advanced permissions
- Payroll module
- AI assistant
- Bulk workflows
- Priority support
- Firm analytics

### Plan 4: Enterprise
For large companies and outsourced accounting providers.
- Custom implementation
- API access
- Dedicated support
- Custom integrations
- Advanced security
- Data processing agreements
- Custom reporting

---

## 15. Revenue Opportunities

- Monthly SaaS subscription
- Per-client pricing
- Per-payroll-employee pricing
- White-label setup fee
- Custom domain fee
- Implementation package
- Training package
- Data migration fee
- Premium AI credits
- Compliance pack add-ons
- Sector template add-ons

---

## 16. Competitive Advantage

The app wins by being:

| Advantage | Description |
|---|---|
| Kenya-first | Built for Kenya's tax system, not adapted from elsewhere |
| Bookkeeper-centred | Designed for firms managing many client companies |
| eTIMS-aware | Strong invoice discipline and tax deductibility workflow |
| Document-strong | Best-in-class document collection and tracking |
| Deadline-driven | Proactive compliance calendar with escalation |
| Owner-simple | Easy enough for SME owners to use without training |
| Firm-professional | Capable enough for serious accounting practices |
| Phone-installable | Full PWA experience for mobile users |
| White-label ready | Firms can brand it as their own platform |
| Audit-trail driven | Every change is traceable and explainable |

---

## 17. Success Metrics

### Firm-Level Metrics
- Number of active firms
- Number of active client companies
- Clients per firm
- Monthly close completion rate
- Document upload completion rate
- Average days to close books
- Return preparation time saved
- Staff productivity per bookkeeper

### Client-Level Metrics
- Missing document count
- Reconciled transaction percentage
- Overdue tax obligations
- Debtor collection days
- Expense support completeness
- Profit report delivery date
- Payroll processing accuracy

### Product Metrics
- Monthly active users
- Document uploads per month
- Transactions processed
- AI suggestions accepted
- Reports generated
- Churn rate
- Support tickets per firm
- Time to onboard client

---

## 18. Risk Areas

### Regulatory Risk
Tax and payroll rules change. The app must use configurable tax and payroll settings and include legal/accounting review before release.

### Integration Risk
Government systems may not offer easy APIs. The app should support export, evidence capture, and workflow tracking even before direct integration.

### Data Protection Risk
The app will process sensitive financial and employee data. Security, access control, audit logs, retention rules, and ODPC compliance planning are mandatory.

### Adoption Risk
SME owners may resist complex tools. The owner interface must be extremely simple: upload, approve, view, pay, and respond.

### Accuracy Risk
AI categorisation may be wrong. Human review must remain central.

---

## 19. Recommended Build Roadmap

### Phase 1: Discovery and Validation
- Interview 10 bookkeepers
- Interview 10 SME owners
- Interview 3 tax consultants
- Map monthly close process
- Map tax calendar
- Define minimum chart of accounts
- Validate pricing

### Phase 2: MVP Build
- Firm portal
- Client workspace
- Documents
- Sales
- Purchases
- Bank/M-Pesa import
- Reconciliation
- Reports
- Compliance calendar
- Monthly close checklist
- PWA install

### Phase 3: Pilot
- Test with 2 accounting firms
- Onboard 10–30 companies
- Track missing documents
- Track time saved
- Improve workflows
- Fix reporting gaps

### Phase 4: Public Launch
- Launch white-label plans
- Add onboarding support
- Create training videos
- Build accountant partner programme
- Add sector templates

### Phase 5: Automation Layer
- OCR
- AI suggestions
- WhatsApp reminders
- Payroll
- Advanced compliance
- API integrations

---

## 20. Final Product Statement

**LedgerPilot Kenya** is a white-label, installable web app that gives accountants, bookkeepers, and SMEs a single place to manage bookkeeping, documents, compliance deadlines, payroll support, eTIMS readiness, reconciliations, and management reporting.

Its purpose is to:
- Reduce chaos
- Improve tax readiness
- Protect companies from missing-document risks
- Help bookkeepers handle more clients
- Give business owners clear financial visibility every month

---

*Last updated: June 2026*

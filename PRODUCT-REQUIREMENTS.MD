# Product Requirements Document (PRD)
## Full-Service Property Management SaaS Platform

---

## 1. Product Overview

### Product Name (Working)
Full-Service Property Management Platform

### Vision
Provide an all-in-one, modern property management SaaS that enables landlords and property managers to run their entire rental business from a single platform—eliminating the need for multiple disconnected tools.

### Mission
Unify leasing, tenant management, maintenance, accounting, communications, and reporting into one centralized system with role-based access and automation.

---

## 2. Problem Statement

Landlords and property managers typically rely on multiple systems for:

- Rent collection
- Lease tracking
- Maintenance coordination
- Tenant communication
- Accounting and reporting
- Document storage

This fragmentation creates inefficiency, errors, missed payments, and poor tenant experiences.

The platform will consolidate all operational workflows into one integrated service.

---

## 3. Goals & Objectives

### Business Goals
- Deliver a complete property management solution for small-to-mid size landlords and PM companies
- Support multi-company SaaS onboarding with subscription-based access
- Reduce operational overhead through automation and centralized workflows

### User Goals
- Manage properties, tenants, leases, and maintenance in one place
- Track rent, expenses, and financial performance easily
- Communicate with tenants seamlessly
- Eliminate the need for spreadsheets or multiple tools

---

## 4. Target Users & Roles

### Role Types

#### 1. Platform Admin (SaaS Operator)
Manages the overall SaaS system and customer companies.

Responsibilities:
- Create and onboard landlord/company accounts
- Manage subscriptions and plans
- Provide support and compliance oversight

#### 2. Company Owner / Landlord Admin
Primary customer account owner.

Responsibilities:
- Manage company settings
- Add properties and staff
- Full access to financials and reporting

#### 3. Property Manager / Staff User
Operational role within a landlord company.

Responsibilities:
- Handle leasing workflows
- Coordinate maintenance
- Communicate with tenants

#### 4. Tenant
End-user renting a unit.

Responsibilities:
- Pay rent
- Submit maintenance requests
- View lease documents and account balance

#### 5. Maintenance Vendor (Optional)
External contractor role.

Responsibilities:
- Receive work orders
- Update job status
- Upload invoices/photos

---

## 5. Core Platform Modules (Full Service Scope)

---

## 5.1 Company & Account Management

### Features
- Multi-tenant SaaS architecture (multiple landlord companies)
- Subscription plan support
- Company profile setup
- Role-based access control (RBAC)

### Requirements
- Each company’s data must be isolated
- Admins can invite users and assign roles

---

## 5.2 Property & Unit Management

### Features
- Property portfolio dashboard
- Units within properties
- Occupancy status tracking
- Unit-level rent and lease configuration

### Data Model
- Company → Property → Unit → Lease → Tenant

---

## 5.3 Tenant & Lease Management

### Features
- Tenant onboarding and profiles
- Lease creation and lifecycle tracking
- Lease start/end dates, renewal workflows
- Security deposit tracking
- Move-in/move-out checklists

### Tenant Portal
- View lease terms
- Upload documents
- Account history

---

## 5.4 Rent Collection & Payments

### Features
- Automated rent invoicing
- Online payments (ACH/Card integration later)
- Payment status tracking
- Late fee automation
- Payment receipts

### Requirements
- Ledger-based accounting system
- Rent schedules per unit

---

## 5.5 Accounting & Financial Management

### Features
- Income and expense tracking
- Property-level profit/loss reporting
- Owner statements
- Bank export-ready reports
- Tax-ready summaries

### Accounting Objects
- Transactions
- Categories
- Rent charges
- Vendor invoices
- Deposits

---

## 5.6 Maintenance & Work Order Management

### Features
- Tenant-submitted maintenance requests
- Work order assignment to staff or vendors
- Status tracking (Open → In Progress → Completed)
- Photo/file uploads
- Vendor invoicing

### Automation
- Notifications on new requests
- SLA reminders for overdue requests

---

## 5.7 Communications & Notifications

### Features
- In-app messaging between tenant and landlord
- Email/SMS notification triggers
- Announcement broadcasting (building-wide notices)

### Requirements
- Communication history stored per tenant/unit

---

## 5.8 Document Management

### Features
- Lease document storage
- Upload agreements, inspections, notices
- Tenant-accessible document vault

### Requirements
- Secure file storage per company

---

## 5.9 Reporting & Analytics

### Key Reports
- Rent roll
- Delinquency report
- Maintenance volume trends
- Occupancy/vacancy rate
- Income vs expenses by property
- Tenant payment history

---

## 5.10 Admin Platform Tools

### Admin Capabilities
- View/manage landlord companies
- Subscription enforcement
- System-wide audit logs
- Support impersonation mode (optional)

---

## 6. Key Workflows

### Landlord Onboarding Flow
1. Admin creates company account
2. Company owner configures properties
3. Staff users invited
4. Tenants added or invited
5. Rent collection activated

---

### Tenant Rent Payment Flow
1. Monthly rent charge generated
2. Tenant notified
3. Tenant pays via portal
4. Ledger updated
5. Receipt issued

---

### Maintenance Request Flow
1. Tenant submits request with photos
2. Landlord assigns work order
3. Vendor updates progress
4. Completion confirmed
5. Invoice logged

---

## 7. Non-Functional Requirements

### Security
- Role-based permissions
- Data isolation per company
- Audit logs for financial actions

### Performance
- Dashboard load < 2 seconds
- Payment workflows must be highly reliable

### Compliance
- PCI compliance when payments enabled
- Secure document storage and access control

### Scalability
- Support thousands of companies and properties, its okay to keep the scale to just a few companies for now
- Modular service expansion

---

## 8. MVP Scope (Phase 1)

### Must Have
- Company onboarding + RBAC
- Property/unit/tenant management
- Lease tracking
- Rent invoicing + payment status tracking (no processor required initially)
- Maintenance requests + work orders
- Basic reporting dashboard

### Nice to Have Later
- Full payment processing
- Vendor marketplace
- Advanced accounting integrations (QuickBooks)
- Mobile app

---

## 9. Success Metrics

- % of landlords managing everything without external tools
- Rent collection completion rate
- Maintenance request resolution time
- Monthly active tenants
- Customer retention and subscription growth

---

## 10. Future Expansion Opportunities

- AI-powered lease renewal recommendations
- Automated tenant screening integrations
- Smart home + IoT maintenance alerts
- Multi-owner investor reporting
- White-label property management firms

---

## Appendix: Entity Summary

| Entity        | Description |
|-------------|-------------|
| Company      | Landlord organization using the SaaS |
| Property     | Physical building or location |
| Unit         | Rentable space within a property |
| Tenant       | Person renting a unit |
| Lease        | Contract binding tenant to unit |
| Payment      | Rent transaction record |
| Maintenance  | Work request and work order lifecycle |
| Vendor       | External contractor handling repairs |

---
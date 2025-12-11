# Property Management Platform – MVP
## Product Requirements Document

## 1. Product Overview
This platform is a property management system where we (the platform owners) act as property managers. Property owners onboard through us and get dashboards to monitor their properties. Tenants also get dashboards for payments, complaints, and communication. The MVP will handle owner onboarding, tenant KYC & digital signing, rent collection, complaints, and vacancy publishing.

## 2. Goals of the MVP
- Provide property owners with a dashboard to view and monitor their properties.
- Provide tenants with a dashboard to manage payments and complaints.
- Implement a structured tenant onboarding flow: KYC → Digital signing → Access.
- Enable secure online rent payments.
- Provide channels for owners and tenants to contact property managers.

## 3. User Roles

### Property Manager (Admin – Our Team)
- Onboard property owners and their properties.
- Manage tenant vetting and lease document setup.
- Handle escalations and complaints.

### Property Owner
- Access an intuitive dashboard.
- View properties, tenants, rent status, and complaints.
- Reach out to the property manager for issues or adjustments.

### Tenant
- Access an intuitive dashboard.
- Submit KYC documents for screening.
- Digitally sign lease agreements.
- Pay rent and utilities.
- Make complaints and track their resolution.

## 4. Core Features (MVP Scope)

### 4.1 Owner Onboarding & Dashboard
- Managers register owners and their properties.
- Properties include: address, type, units, rent cost, and utility charges.
- Owners get dashboards to:
  - Track rent collection status.
  - See active tenants and vacancies.
  - Monitor complaints/issues.
  - Contact property managers for adjustments.

### 4.2 Tenant Onboarding Flow (Two-Stage)

#### Stage 1 – KYC Screening
- Tenant fills out digital KYC form.
- Upload required documents (ID, employment proof, guarantor info).
- Submitted for property manager review.

#### Stage 2 – Lease Agreement Signing
- Once approved, the tenant receives a digital lease agreement.
- Tenant signs electronically (legally binding e-signature).
- After signing, the tenant receives login credentials by email to access the mobile app/dashboard.

### 4.3 Tenant Dashboard
- Pay rent and utility bills.
- View rent history and download receipts.
- Submit and track complaints.
- Access signed lease agreements and important notices.

### 4.4 Rent Payment
- Automated invoices and reminders.
- Online payment integration (card, bank transfer, mobile money).
- Payment receipts for both tenant and owner.
- Dashboard for managers and owners to track rent status.

### 4.5 Complaint & Maintenance Requests
- Tenants submit complaints (text + optional photos/videos).
- Managers assign and update status.
- Tracking system: Open → In Progress → Resolved.
- Owners can see the status of issues affecting their properties.

### 4.6 Vacancy Publishing
- Managers can mark a unit as vacant.
- Vacancies are listed on the platform website with property details.
- Prospective tenants can apply, starting with the KYC Stage 1.

## 5. Out of Scope (For Future Versions)
- Advanced analytics and reporting.
- Marketplace for external services (repairs, cleaning, insurance).
- Multi-owner collaboration and multiple manager roles.
- Full-featured mobile apps (MVP may start with responsive web + basic mobile app).

## 6. Success Metrics
- Number of property owners onboarded.
- Percentage of tenants who complete KYC & lease signing.
- Rent payment success rate.
- Average complaint resolution time.
- Owner and tenant satisfaction ratings.

## 7. Technical Requirements
- **Backend**: Django DRF / FastAPI.
- **Frontend**: React (web) + React Native (mobile app).
- **Database**: PostgreSQL.
- **Payments**: Paystack/Stripe/Flutterwave.
- **Digital Signing**: Integration with DocuSign or similar e-signature API.
- **Security**: Role-based access, encrypted document storage, KYC compliance.

## 8. Tenant Onboarding Flow (Detailed)
1. Tenant applies or is invited.
2. Fills out KYC form + uploads docs.
3. Property manager reviews and approves/rejects.
4. If approved → Tenant receives digital lease agreement.
5. Tenant signs electronically.
6. System auto-generates tenant login credentials and sends them via email.
7. Tenant logs in and gets access to dashboard/mobile app.

---

## Additional Requirements (From Discussions)

### Owner Onboarding Flow
1. Admin sends email with link to property owner
2. Owner fills form on frontend and adds properties
3. Owner can optionally add existing tenant emails
4. Admin can also manually add tenants

### Admin Dashboard Hierarchy
The admin needs a hierarchical view showing:
- **Landlord** → **Properties** → **Tenants** → **Status**
- Real-time status updates when tenants move in/out
- Color-coded rent status indicators
- Quick actions for common tasks

### KYC Auto-Approval
- System implements rule-based auto-approval
- Flagged applications go to admin review queue
- Auto-approve criteria configurable

### Status Tracking
- Property status: Vacant | Occupied | Under Review
- Rent status: Current | Overdue | Delinquent
- Complaint status: Open | In Progress | Resolved

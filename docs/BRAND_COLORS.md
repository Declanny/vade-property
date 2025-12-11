# TruVade Admin - Brand Colors Applied

## Brand Colors

### Primary Colors
- **Primary Green (Dark):** `#0B3D2C` - Main brand color
- **Primary Green (Light):** `#0F5240` - Hover states and gradients
- **Primary Green (Darker):** `#072820` - Deep accents

### Accent Colors
- **Primary Bronze:** `#B87333` - Accent/secondary brand color
- **Bronze Light:** `#CA8E56` - Lighter accents and gradients
- **Bronze Dark:** `#A06328` - Darker bronze accents

### Semantic Colors (Unchanged)
- **Success:** `#10B981` (Green)
- **Warning:** `#F59E0B` (Orange/Amber)
- **Error:** `#EF4444` (Red)
- **Info:** `#3B82F6` (Blue)

## Where Brand Colors Are Applied

### 1. Admin Sidebar (`AdminSidebar.tsx`)
- ✅ Logo: "Tru" in green, "Vade" in bronze
- ✅ Admin badge: Dark green background
- ✅ Active navigation items: Dark green background with white text
- ✅ User avatar: Dark green background

### 2. Admin Header (`AdminHeader.tsx`)
- ✅ Search input focus ring: Green

### 3. Main Dashboard (`/admin`)
- ✅ Quick action cards:
  - "Invite Property Owner": Green gradient
  - "Review KYC": Bronze gradient
  - "Handle Complaints": Red (semantic)

### 4. Owner Management (`/admin/owners/*`)
- ✅ "Invite Owner" button: Dark green
- ✅ Owner avatars: Dark green background
- ✅ "Send Invitation" button: Dark green
- ✅ Back links: Dark green text

### 5. Property Hierarchy View (`OwnerPropertyHierarchy.tsx`)
- ✅ Owner avatars: Dark green background
- ✅ "View Lease" button: Dark green
- ✅ "Send Message" button: Bronze
- ✅ "Publish Vacancy" button: Dark green
- ✅ "Assign Tenant" button: Bronze
- ✅ Tenant avatars: Bronze background

### 6. KYC Review (`/admin/kyc`)
- ✅ Applicant avatars: Bronze background
- ✅ "View" document button: Dark green
- ✅ "Download" document button: Bronze
- ✅ "Approve & Send Lease" button: Dark green
- ✅ "Reject" button: Red (semantic)

### 7. Complaints (`/admin/complaints`)
- ✅ "Start Progress" button: Dark green
- ✅ "Assign To" button: Bronze
- ✅ "Mark Resolved" button: Green (semantic)

### 8. Payments (`/admin/payments`)
- ✅ "Export Report" button: Dark green

### 9. Vacancies (`/admin/vacancies`)
- ✅ "Publish" button: Dark green
- ✅ "Edit" button: Bronze
- ✅ "Unpublish" button: Red (semantic)

### 10. Properties (`/admin/properties`)
- ✅ "View Details" button: Dark green

### 11. Tenants (`/admin/tenants`)
- ✅ Tenant avatars: Bronze background

## Color Usage Guidelines

### When to Use Dark Green (#0B3D2C)
- Primary action buttons (Approve, Publish, Save, Send)
- Active navigation states
- Owner/Admin avatars
- Main brand elements
- Links and interactive elements

### When to Use Bronze (#B87333)
- Secondary action buttons (Edit, Send Message, Assign)
- Tenant avatars
- Accent elements
- "Vade" in logo
- Supporting interactive elements

### When to Use Semantic Colors
- **Red (#EF4444)**: Destructive actions (Delete, Reject, Unpublish), Error states
- **Green (#10B981)**: Success states, "Resolved" status, Positive metrics
- **Yellow/Orange (#F59E0B)**: Warnings, "Pending" states, Overdue payments
- **Gray**: Neutral/Cancel actions

## Visual Identity

### Logo
- "Tru" in Dark Green (#0B3D2C)
- "Vade" in Bronze (#B87333)
- Admin badge: Dark green background, white text

### Color Combinations
✅ **Recommended:**
- White background + Dark Green buttons
- Light gray background + Dark Green/Bronze accents
- Dark Green primary + Bronze secondary
- White text on Dark Green or Bronze backgrounds

❌ **Avoid:**
- Generic blue colors (replaced with brand green)
- Purple colors (replaced with bronze)
- Non-semantic color usage

## Implementation Notes

All color updates use inline styles for brand colors to ensure consistency:
```tsx
style={{ backgroundColor: '#0B3D2C' }}
style={{ backgroundColor: '#B87333' }}
```

This approach ensures:
1. Easy maintenance (change colors in one place)
2. No Tailwind config conflicts
3. Precise brand color matching
4. Quick visual identification of brand elements

## Future Enhancements

Consider adding to `globals.css`:
```css
:root {
  /* Already defined */
  --primary-green: #0B3D2C;
  --primary-bronze: #B87333;
}
```

Then use in components:
```tsx
className="bg-primary" // using Tailwind theme
```

This would allow Tailwind utilities like:
- `bg-primary` → Dark Green
- `bg-accent` → Bronze
- `text-primary` → Dark Green text
- `hover:bg-primary-light` → Hover states

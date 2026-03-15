# GST Billing SaaS Frontend - Complete Documentation

## 📋 Project Overview

**GST Billing SaaS** is a professional invoicing and billing application designed for businesses to manage customers, products, and invoices with GST (Goods and Services Tax) compliance. The frontend is a responsive web application built with modern technologies, featuring a mobile-first design that works seamlessly across all devices.

### Key Objectives
- Provide a user-friendly interface for invoice management
- Handle customer and product database
- Generate compliant GST invoices
- Support PDF download functionality
- Ensure secure authentication and data protection
- Deliver responsive design across all screen sizes

---

## 🏗️ Tech Stack

### Frontend Framework & Runtime
- **Next.js**: v16.1.6 (React server components with App Router)
- **React**: v19.2.3 (UI library)
- **TypeScript**: v5 (Type safety and developer experience)

### Styling & UI
- **Tailwind CSS**: v4 (Utility-first CSS framework)
- **shadcn/ui**: v4.0.5 (Pre-built component library)
- **Lucide React**: v0.577.0 (Icon library)
- **Radix UI**: v1.4.3 (Headless UI primitives)
- **Class Variance Authority**: v0.7.1 (Component variant management)
- **Tailwind Merge**: v3.5.0 (Utility conflict resolution)

### State Management & Data
- **Zustand**: v4.5.5 (Lightweight state management with localStorage persistence)
- **Axios**: v1.7.7 (HTTP client with interceptors for JWT handling)

### Development Tools
- **ESLint**: v9 (Code quality)
- **PostCSS**: v4 (CSS processing)
- **Tailwind PostCSS**: v4 (CSS framework compilation)

### Development Environment
- Node.js (Modern JavaScript runtime)
- npm/yarn (Package management)

---

## 🧬 Architecture Overview

### Application Structure

```
Frontend Application
├── Authentication Layer
│   ├── Login & Signup Pages
│   ├── JWT Token Management
│   └── Route Protection (Middleware + Client-side)
│
├── Dashboard Core
│   ├── Sidebar Navigation
│   ├── Header with User Avatar
│   └── Dashboard Metrics
│
├── Business Modules
│   ├── Customers Management
│   ├── Products Management
│   ├── Invoices Management
│   └── Settings
│
└── Infrastructure
    ├── Zustand State Management
    ├── Axios API Client
    ├── Component System (shadcn/ui)
    └── Responsive Design System
```

### Data Flow Architecture

```
User Input
    ↓
React Component
    ↓
Zustand Store (State)
    ↓
Axios API Client (JWT Interceptor)
    ↓
Backend API (http://localhost:3001/api)
    ↓
Response Processing
    ↓
UI Update
```

---

## 🔄 Intended User Flow

### 1. **Initial Access**
- User visits application home (`/`)
- App checks authentication status via middleware
- Unauthenticated users are redirected to `/login`

### 2. **Authentication Flow**
```
Unauthenticated User
    ↓
Login Page (/login) OR Signup Page (/signup)
    ↓
Credentials Submitted (Email + Password)
    ↓
API Authentication Request
    ↓
JWT Token Received & Stored (localStorage via Zustand)
    ↓
Redirected to Dashboard (/dashboard)
```

### 3. **Dashboard Navigation**
- User sees sidebar with navigation options:
  - Dashboard (home with metrics)
  - Customers
  - Products
  - Invoices
  - Settings
- Header shows user avatar and logout option

### 4. **Business Operations**

#### Customers Module Flow
```
View Customers List
    ↓
Create/Edit/Delete Customers
    ↓
Search & Filter
    ↓
Data synced with backend
```

#### Products Module Flow
```
View Products List (with HSN codes, GST rates)
    ↓
Add/Edit/Delete Products
    ↓
Set pricing & tax information
    ↓
Data persisted on backend
```

#### Invoices Module Flow
```
View Invoices List (Filter by status: Paid/Pending/Overdue)
    ↓
Create New Invoice
    ├─ Select Customer
    ├─ Select Products
    ├─ Apply Discounts
    └─ Calculate GST automatically
    ↓
Preview Invoice
    ↓
Generate PDF & Download
    ↓
Mark as Paid/Update Status
```

### 5. **Session Management**
- User can logout from header
- Logout clears token & user data
- Redirects to login page
- Expired sessions (401 errors) auto-redirect to login

---

## 📁 File Structure & Organization

### Root Configuration Files
```
package.json              # Dependencies and scripts
tsconfig.json            # TypeScript configuration
next.config.ts           # Next.js configuration
middleware.ts            # Route protection middleware
postcss.config.mjs       # PostCSS configuration
eslint.config.mjs        # ESLint rules
components.json          # shadcn/ui configuration
```

### `/app` - Application Routes (Next.js App Router)

```
app/
├── layout.tsx                    # Root layout (global HTML structure)
├── page.tsx                      # Home page (/ route) - redirects based on auth
├── globals.css                   # Global styles and design tokens
│
├── (auth)/                       # Auth route group
│   ├── login/
│   │   └── page.tsx             # Login form page
│   └── signup/
│       └── page.tsx             # Signup form page
│
├── login/
│   └── page.tsx                 # Alternative login route
│
├── signup/
│   └── page.tsx                 # Alternative signup route
│
└── dashboard/                    # Protected dashboard routes
    ├── layout.tsx               # Dashboard layout (header + sidebar)
    ├── page.tsx                 # Dashboard home (metrics & overview)
    ├── customers/
    │   └── page.tsx             # Customers listing & management
    ├── products/
    │   └── page.tsx             # Products listing & management
    ├── invoices/
    │   └── page.tsx             # Invoices listing & management
    └── settings/
        └── page.tsx             # Business settings & configuration
```

### `/components` - Reusable UI Components

```
components/
├── app-header.tsx               # Header with user info, hamburger menu
├── app-sidebar.tsx              # Navigation sidebar (collapsible on mobile)
├── metric-card.tsx              # Dashboard metric card component
├── protected-route.tsx          # Higher-order component for route protection
│
├── dashboard/                   # Dashboard-specific components
│   └── (dashboard-only components)
│
├── forms/                       # Form components
│   └── (form-specific components)
│
└── ui/                          # shadcn/ui Components
    ├── button.tsx               # Reusable button component
    ├── card.tsx                 # Card container component
    ├── dialog.tsx               # Modal dialog component
    ├── dropdown-menu.tsx        # Dropdown menu component
    ├── input.tsx                # Text input component
    ├── label.tsx                # Form label component
    ├── select.tsx               # Select dropdown component
    ├── separator.tsx            # Visual separator component
    ├── sheet.tsx                # Slide-out sheet/modal component
    ├── sidebar.tsx              # Sidebar container component
    ├── skeleton.tsx             # Loading skeleton component
    ├── table.tsx                # Data table component
    ├── textarea.tsx             # Multi-line text input
    └── tooltip.tsx              # Tooltip component
```

### `/lib` - Utility Functions & API Clients

```
lib/
├── api.ts                       # Axios HTTP client with JWT interceptors
│                                 # - Base URL configuration
│                                 # - Auth token injection
│                                 # - 401 error handling
│                                 # - Auto-redirect on auth failure
│
└── utils.ts                     # Helper utilities
                                 # - cn() function (classname merging)
                                 # - Other utility functions
```

### `/store` - State Management

```
store/
└── authStore.ts                 # Zustand authentication store
                                 # - User state (id, name, email, gstin, businessName)
                                 # - Token state
                                 # - Loading & error states
                                 # - Actions: setUser, setToken, logout
                                 # - localStorage persistence
```

### `/public` - Static Assets

```
public/                          # Static files served directly
├── images/
├── icons/
└── (other static assets)
```

### `/hooks` - Custom React Hooks

```
hooks/
└── use-mobile.ts                # Hook to detect mobile screen size
```

---

## 🎯 Core Components & Units

### Authentication Components

#### `components/protected-route.tsx`
- Wraps routes that require authentication
- Checks token availability from Zustand store
- Redirects to login if unauthorized
- Displays loading state during auth check

#### `app/(auth)/login/page.tsx`
- Email/password login form
- Password visibility toggle
- Form validation
- Demo credentials support
- API integration for authentication
- Token storage in Zustand + localStorage

#### `app/(auth)/signup/page.tsx`
- User registration form
- Password confirmation
- Email validation
- Auto-login after signup
- Error handling

### Layout Components

#### `components/app-header.tsx`
- Fixed/sticky header
- User avatar display
- Hamburger menu toggle (mobile)
- Logout button
- Profile/settings link

#### `components/app-sidebar.tsx`
- Navigation menu
- Module links (Dashboard, Customers, Products, Invoices, Settings)
- Responsive behavior (offcanvas on mobile, persistent on desktop)
- Active route highlighting
- Logout option

### Dashboard Components

#### `app/dashboard/page.tsx`
- Metric cards (4-column desktop, stacked mobile)
- Key metrics: Total Revenue, Invoices, Customers, Products
- Recent invoices table/card view
- Loading skeleton states

#### `components/metric-card.tsx`
- Displays key metrics
- Responsive design
- Icons and values
- Loading skeleton variant

### Data Management Components

#### `app/dashboard/customers/page.tsx`
- Customer listing (table on desktop, cards on mobile)
- Create/Edit/Delete functionality
- Search capability
- Confirmation dialogs
- Form validation

#### `app/dashboard/products/page.tsx`
- Product listing with HSN codes and GST rates
- Product management (CRUD operations)
- Responsive layouts
- Import/Export ready

#### `app/dashboard/invoices/page.tsx`
- Invoice listing with status filtering (Paid/Pending/Overdue)
- Create invoice workflow
- Invoice preview & PDF download
- Status updates
- Mobile-optimized cards

#### `app/dashboard/settings/page.tsx`
- Business profile settings
- GSTIN configuration
- Address and contact information
- Multi-column desktop layout
- Form validation and submission

---

## 🔐 State Management (Zustand)

### Auth Store (`store/authStore.ts`)

**State Structure:**
```typescript
{
  user: {
    id: string
    name: string
    email: string
    gstin?: string
    businessName?: string
  } | null
  token: string | null
  isLoading: boolean
  error: string | null
}
```

**Actions:**
- `setUser(user)` - Update user information
- `setToken(token)` - Store JWT token
- `setLoading(loading)` - Toggle loading state
- `setError(error)` - Set error message
- `clearError()` - Clear error state
- `logout()` - Clear all auth data

**Persistence:**
- Stored in localStorage under `auth-storage` key
- Auto-hydrated on app load
- Only `user` and `token` fields are persisted

---

## 🔗 API Integration

### Axios Configuration (`lib/api.ts`)

**Base URL:**
```
http://localhost:3001/api
```

**Request Interceptor:**
- Automatically injects JWT token in `Authorization` header
- Format: `Bearer {token}`
- Token retrieved from Zustand store

**Response Interceptor:**
- Handles 401 (Unauthorized) responses
- Auto-logout on expired tokens
- Redirects to login page
- Other errors passed through

**Usage Example:**
```typescript
import api from '@/lib/api'

// GET request
const response = await api.get('/customers')

// POST request with data
const newCustomer = await api.post('/customers', { name: 'John' })

// PUT/PATCH request
await api.patch('/customers/1', { name: 'Updated' })

// DELETE request
await api.delete('/customers/1')
```

---

## 🛣️ Routing & Navigation

### Route Structure

```
/                          # Home (redirects to /login or /dashboard)
├── /login                 # Login page (public)
├── /signup                # Signup page (public)
└── /dashboard             # Protected dashboard (requires auth)
    ├── /dashboard         # Dashboard home (metrics)
    ├── /dashboard/customers   # Customers module
    ├── /dashboard/products    # Products module
    ├── /dashboard/invoices    # Invoices module
    └── /dashboard/settings    # Settings module
```

### Route Protection

**Server-side (Middleware):**
- Checks JWT token in cookies
- Protects `/dashboard/*` routes
- Redirects to `/login` if unauthorized

**Client-side:**
- `ProtectedRoute` wrapper component
- Displays loading state during auth check
- Redirects in browser if auth fails

**Combined Approach:**
- Middleware catches unauth on initial load
- Client-side protection for SPA navigation
- 401 interceptor handles expired tokens

---

## 🎨 Design System

### Color Palette
- **Primary**: `oklch(0.3 0.15 260)` - Professional blue
- **Background**: `oklch(1 0 0)` - White
- **Foreground**: `oklch(0.15 0 0)` - Near black
- Additional colors defined in Tailwind config

### Responsive Breakpoints
- **Mobile**: 320px - 480px (stacked layout)
- **Tablet**: 768px - 1024px (adaptive layout)
- **Desktop**: 1440px+ (full multi-column layout)

### Component Library (shadcn/ui)
- Pre-built, customizable components
- Leverages Radix UI primitives
- Tailwind CSS styling
- Accessible by default

### Typography
- Uses Geist font family (Vercel)
- Responsive font sizes
- Semantic heading hierarchy

---

## 🔄 Data Flow Example: Creating an Invoice

```
1. User navigates to /dashboard/invoices
   ↓
2. Page loads, fetches invoices list via API
   ↓
3. Axios request sent with JWT token
   ↓
4. User clicks "Create Invoice"
   ↓
5. Form opens with customer & product selectors
   ↓
6. User selects customer and adds products
   ↓
7. System calculates: Subtotal → GST → Total
   ↓
8. User clicks "Create"
   ↓
9. POST request to /api/invoices with invoice data
   ↓
10. API validates and saves invoice
   ↓
11. Response returns with invoice ID
   ↓
12. Success notification shown
   ↓
13. Page redirects to invoice preview or list
   ↓
14. Updated UI reflects new invoice
```

---

## 🚀 Key Features Implemented

### Phase 1: Authentication & Foundation ✅
- Global responsive layout
- Sidebar navigation system
- Sticky header with user avatar
- Zustand auth store with localStorage
- JWT-enabled Axios client
- Auth pages (Login & Signup)
- Route protection (middleware + client)

### Phase 2: Dashboard & Core Modules ✅
- Dashboard home with metrics
- Customers CRUD operations
- Products management
- Invoices listing with status filters
- Invoice creation workflow
- Invoice preview functionality
- PDF download support
- Settings page

### Phase 3: Polish & UX ✅
- Loading skeleton states
- Toast notifications (integrated)
- Delete confirmations
- Empty states handling
- Mobile-optimized touch targets (44x44px)
- Responsive testing across devices

---

## 📱 Responsive Design

### Mobile-First Approach
- **Headers**: Stack vertically
- **Lists**: Card-based layout
- **Tables**: Convert to cards on mobile
- **Forms**: Single column
- **Sidebar**: Offcanvas/drawer menu

### Desktop Enhancements
- **Multi-column grids**: Metric cards (4 columns)
- **Data tables**: Full tables with pagination
- **Sidebar**: Persistent, always visible
- **Forms**: Multi-column layouts

---

## 🔧 Development Setup

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 📚 Project Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.1.6 | React framework with SSR |
| React | 19.2.3 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | 4.0.5 | Component library |
| Zustand | 4.5.5 | State management |
| Axios | 1.7.7 | HTTP client |
| Lucide React | 0.577.0 | Icons |
| Radix UI | 1.4.3 | UI primitives |

---

## 🎯 Current Capabilities

✅ User authentication (Login/Signup)
✅ Protected dashboard access
✅ Customer management (CRUD)
✅ Product management (CRUD)
✅ Invoice listing and filtering
✅ Invoice creation workflow
✅ Responsive mobile design
✅ Persistent authentication
✅ Error handling with toasts
✅ Loading states with skeletons
✅ Confirmation dialogs
✅ PDF download ready

---

## 🔮 Future Enhancement Areas

- [ ] Advanced invoice filters and search
- [ ] Invoice template customization
- [ ] Payment gateway integration
- [ ] Email invoice sending
- [ ] Automated reminders
- [ ] Analytics dashboard
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Two-factor authentication
- [ ] Bulk operations (CSV import/export)
- [ ] Invoice recurring/subscription
- [ ] Multi-user/team support

---

## 📞 Support & Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Zustand**: https://github.com/pmndrs/zustand
- **Axios**: https://axios-http.com

---

## 📝 Notes

- Backend API expected at `http://localhost:3001/api`
- Customize via `process.env.NEXT_PUBLIC_API_URL`
- Demo credentials available in login page
- All state persists across browser sessions
- Token auto-refresh via 401 interceptor

Last Updated: March 15, 2026

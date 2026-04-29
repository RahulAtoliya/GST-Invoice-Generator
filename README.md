# GST Invoice Generator

A modern, responsive GST invoice generator for Indian businesses built with Next.js, TypeScript, Tailwind CSS, React Hook Form, Zod, LocalStorage, and jsPDF.

The app lets users create GST invoices, save profile defaults, manage invoice history, preview invoices, and download clean A4 PDF tax invoices. It also includes a public landing page and a local admin dashboard for viewing registered users.

## Features

- Public landing page for visitors
- Mobile-first responsive UI
- Local signup and login flow
- Profile settings for default seller details
- Business logo upload for invoices
- GST invoice creation form
- Zod form validation with helpful errors
- Automatic invoice calculations
- CGST + SGST and IGST support
- GST rates: 0%, 5%, 12%, 18%, 28%
- Taxable amount, discount, GST breakup, grand total
- Amount in words
- Professional invoice preview
- Downloadable A4 PDF invoice using jsPDF
- PDF filename format: `GST-Invoice-{invoice-number}.pdf`
- Invoice history with edit, delete, and re-download
- Per-user invoice storage in LocalStorage
- Admin login and user management dashboard
- Contact section for custom software development inquiries

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- jsPDF
- Lucide React icons
- Sonner toast notifications
- LocalStorage

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/gst-invoice-generator.git
cd gst-invoice-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the app in your browser:

```bash
http://localhost:3000
```

If port `3000` is already in use, Next.js may ask you to use another port.

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after building.

```bash
npm run lint
```

Runs ESLint checks.

```bash
npm run typecheck
```

Runs TypeScript type checking.

## App Routes

| Route | Description |
| --- | --- |
| `/` | Public landing page |
| `/signup` | User signup |
| `/login` | User login |
| `/dashboard` | User invoice dashboard |
| `/profile` | Default seller profile and logo settings |
| `/invoices` | Invoice history |
| `/invoices/new` | Create a new GST invoice |
| `/invoices/[id]` | Preview, edit, delete, and download an invoice |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard and user management |

## Admin Credentials

The current admin login is local/demo only:

```txt
Email: admin@gst.local
Password: admin123
```

You can update these values in:

```txt
src/lib/admin.ts
```

## Folder Structure

```txt
src/
  app/
    admin/
    dashboard/
    invoices/
    login/
    profile/
    signup/
    page.tsx
    layout.tsx
    globals.css
  components/
    invoice/
      invoice-form.tsx
      invoice-preview.tsx
    layout/
      admin-guard.tsx
      app-shell.tsx
      auth-guard.tsx
    ui/
      button.tsx
  lib/
    admin.ts
    auth.ts
    calculations.ts
    pdf.ts
    storage.ts
    utils.ts
    validations.ts
  types/
    auth.ts
    invoice.ts
```

## Invoice Fields

The invoice form supports:

- Seller business name
- Seller GSTIN
- Seller address
- Seller phone/email
- Seller logo
- Buyer name
- Buyer GSTIN
- Buyer address
- Invoice number
- Invoice date
- Due date
- Place of supply
- State code
- Item/service name
- HSN/SAC code
- Quantity
- Unit price
- Discount
- GST rate
- Tax type
- Notes
- Terms and conditions

## Calculations

The app automatically calculates:

- Line amount
- Discount amount
- Taxable amount
- CGST
- SGST
- IGST
- Total GST
- Grand total
- Amount in words

## LocalStorage Data

This project currently stores data in browser LocalStorage:

- User accounts
- Current user session
- User profile defaults
- Uploaded logo data URL
- Invoices
- Admin session

Invoices are stored per logged-in user.

## Important Security Note

This project uses LocalStorage-based authentication for demo purposes only. Passwords are stored in the browser and are not secure for production use.

For a real production app, replace LocalStorage auth with a secure backend or authentication provider such as:

- NextAuth/Auth.js
- Clerk
- Supabase Auth
- Firebase Auth
- Custom backend with encrypted password storage

You should also move invoice data to a database such as PostgreSQL, MySQL, MongoDB, Firebase, or Supabase.

## PDF Download

Invoices can be downloaded as printable A4 PDFs. The PDF generator is located at:

```txt
src/lib/pdf.ts
```

The generated filename follows this format:

```txt
GST-Invoice-{invoice-number}.pdf
```

## Customization

### Contact Details

The landing page contact details are defined in:

```txt
src/app/page.tsx
```

Update the `contactLinks` array to change:

- Email
- Phone number
- LinkedIn URL
- GitHub URL

### Theme Colors

Theme colors and shared styling are defined in:

```txt
tailwind.config.js
src/app/globals.css
```

## Deployment

The easiest way to deploy this project is with Vercel.

### Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Keep the default Next.js settings.
4. Deploy.

Build command:

```bash
npm run build
```

Output directory:

```txt
.next
```

## Suggested Future Improvements

- Backend API
- Real authentication
- Database storage
- Role-based admin access
- Invoice number sequencing
- Company/team workspaces
- Email invoice to buyer
- Payment status tracking
- Export invoices to Excel/CSV
- GST reports
- E-way bill/e-invoice integrations

## Author

Created by Rahul Atoliya.

For customized software development, use the contact section on the landing page.

## License

This project is currently not licensed. Add a license file before distributing it publicly if needed.

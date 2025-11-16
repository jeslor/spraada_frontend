# Spraada Frontend

A modern Next.js application for the Spraada platform - a peer-to-peer tool rental marketplace where users can rent and lend tools to their community.

## 🚀 Features

- **Tool Rental Marketplace** - Browse, rent, and lend tools within your community
- **Modern React 19** - Latest React features with concurrent rendering
- **Next.js 16** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development experience
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **Responsive Design** - Mobile-first responsive interface
- **Authentication Flow** - JWT-based auth with onboarding redirection
- **API Integration** - Seamless integration with Spraada Backend API

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Frontend Library**: React 19
- **Authentication**: JWT tokens
- **HTTP Client**: Fetch API / Axios
- **State Management**: React Context / Zustand (when needed)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Spraada Backend API running (see backend README)

## 🏗 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd spraada_fronend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚦 Running the Application

### Development

```bash
npm run dev
# App runs on http://localhost:3001
```

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## 📱 Application Structure

```
app/
├── globals.css          # Global styles
├── layout.tsx          # Root layout
├── page.tsx            # Home page (tool browse)
├── auth/               # Authentication pages
│   ├── signin/         # Sign in page
│   ├── signup/         # Sign up page
│   └── layout.tsx      # Auth layout
├── dashboard/          # Protected dashboard
│   ├── page.tsx        # Dashboard home
│   └── layout.tsx      # Dashboard layout
├── onboarding/         # User onboarding flow
│   └── page.tsx        # Complete profile page
├── tools/              # Tool-related pages
│   ├── browse/         # Browse available tools
│   ├── [id]/           # Individual tool details
│   └── add/            # Add new tool listing
├── bookings/           # Rental management
│   ├── page.tsx        # My rentals and bookings
│   └── [id]/           # Booking details
├── components/         # Reusable components
├── lib/               # Utility functions
└── types/             # TypeScript type definitions
```

## 🔗 API Integration

### Authentication Flow

```typescript
// Sign in example
const signIn = async (email: string, password: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (!data.isOnboarded) {
    router.push("/onboarding");
  } else {
    router.push("/dashboard");
  }
};
```

### Protected API Calls

```typescript
// Authenticated request example
const getUserProfile = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
```

## 🎨 Styling with Tailwind CSS 4

### Component Example

```tsx
export default function Button({ children, variant = "primary" }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" && "bg-gray-200 text-gray-800 hover:bg-gray-300"
      )}
    >
      {children}
    </button>
  );
}
```

### Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

## 🔒 Authentication State Management

### Context Provider Example

```tsx
"use client";

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, userData: User) => {
    localStorage.setItem("access_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    router.push("/auth/signin");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

## 📄 Key Pages & Components

### 1. Authentication Pages

- **Sign In** (`/auth/signin`) - User login with email/password
- **Sign Up** (`/auth/signup`) - New user registration

### 2. Tool Management

- **Browse Tools** (`/tools/browse`) - Search and filter available tools
- **Tool Details** (`/tools/[id]`) - Individual tool information and booking
- **Add Tool** (`/tools/add`) - List a new tool for rent

### 3. Rental Management

- **My Bookings** (`/bookings`) - View rental history and active bookings
- **Booking Details** (`/bookings/[id]`) - Individual booking management

### 4. Onboarding Flow

- **Complete Profile** (`/onboarding`) - First-time user profile setup
- Triggered when `isOnboarded: false` from backend

### 5. Dashboard

- **User Dashboard** (`/dashboard`) - Protected user area with rental overview
- **Profile Management** - Edit user profile and settings

### 6. Core Components

- **Tool Components** - Tool cards, search filters, booking forms
- **Layout Components** - Navigation, headers, footers
- **Form Components** - Reusable form inputs and validation
- **UI Components** - Buttons, modals, cards, etc.

## 🔧 Development Guidelines

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Pages: `page.tsx` (Next.js App Router convention)
- Utilities: `camelCase.ts` (e.g., `apiHelpers.ts`)

### TypeScript Types

```typescript
// types/auth.ts
export interface User {
  id: number;
  email: string;
  isOnboarded: boolean;
}

export interface AuthResponse {
  access_token: string;
  isOnboarded: boolean;
  user: User;
}
```

## 📦 Available Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🚨 Environment Variables

### Required Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000    # Backend API URL
NEXT_PUBLIC_APP_URL=http://localhost:3001    # Frontend URL

# Optional: Analytics, etc.
NEXT_PUBLIC_GA_ID=your-ga-id
```

## 🧪 Testing (When Implemented)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure backend allows frontend origin
   - Check API_URL in environment variables

2. **Authentication Issues**

   - Verify JWT token storage and format
   - Check token expiration
   - Ensure backend is running

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Development Tips

- Use React Developer Tools for debugging
- Enable TypeScript strict mode for better type safety
- Use Next.js built-in Image component for optimized images
- Leverage Next.js middleware for authentication routes

## 📝 Contributing

1. Create feature branch from `main`
2. Follow TypeScript and ESLint rules
3. Test changes thoroughly
4. Submit pull request with clear description

## 🔗 Related Projects

- [Spraada Backend](../spraada_backend) - NestJS API backend
- Backend API documentation available at backend URL

## 📄 License

[Add your license information here]

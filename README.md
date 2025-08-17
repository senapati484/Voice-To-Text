# Voice-to-Text Application

A modern React application that converts voice input to text, built with Next.js, TypeScript, and a comprehensive UI component system.

## Tech Stack

### Core Technologies

- **React 19** - Frontend library for building user interfaces
- **Next.js 15** - React framework for production-grade applications
- **TypeScript** - Static type checking for JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### UI Components

- **Radix UI** - Headless UI components for building accessible interfaces
- **Shadcn/ui** - Beautiful and customizable UI components
- **Lucide React** - Beautiful icons
- **Next Themes** - Theme management for Next.js
- **Sonner** - Toast notifications
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Features

- 🎨 Modern and responsive UI
- 🌙 Dark/Light mode support
- 📱 Mobile-responsive design with custom hooks
- ♿ Accessible components using Radix UI
- 🎯 Form validation using Zod
- 🔔 Toast notifications
- 📊 Data visualization with Recharts

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/senapati484/Voice-To-Text.git
cd voice-to-text
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Start the development server

```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # UI components
│   └── theme-provider  # Theme context provider
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Custom Hooks

### useIsMobile

A custom hook for responsive design that detects mobile viewport:

```typescript
const isMobile = useIsMobile();
```

### useToast

A custom hook for managing toast notifications:

```typescript
const { toast } = useToast();
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

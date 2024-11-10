# Task management Frontend Application

A modern React.js frontend application built with Vite, featuring a responsive design, RTK Query for state management, and Tailwind CSS for styling.

## ⚡️ Features

- React 18+ with Hooks
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- RTK Query thunk for API integration and data fetching
- Form validation with Formik and yup
- Responsive design

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Abdurrahman-Alizada/task-managment-frontend.git
cd task-managment-frontend-main
```

### 3. Installation & Development

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Lint code
```

## 🏗️ Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable components
├── pages/          # Page components
├── redux/          # Redux store setup
```

## 🚀 Deployment

### GitHub Repository

1. Create a new repository on GitHub
2. Push your code:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure project settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. No environment variables needed
5. Deploy
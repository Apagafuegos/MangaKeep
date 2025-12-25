# MangaKeep

MangaKeep is a modern, personal manga collection tracker built with [Next.js 16](https://nextjs.org/) and [Supabase](https://supabase.com/). It allows users to effortlessly manage their manga library, track volumes, organize collections, and more.

## Features

-   **Library Management**: Easily add and classify your manga volumes.
-   **Collections**: Organize volumes into named collections for better organization.
-   **Import Functionality**: Bulk import your library via CSV support.
-   **Barcode Scanning**: Quickly add volumes by scanning ISBN barcodes directly from your device.
-   **Authentication**: Secure user authentication powered by Supabase.
-   **Dark/Light Mode**: Fully themable UI with dark mode support.
-   **PWA Support**: Installable as a Progressive Web App for a native-like experience on mobile.
-   **Responsive Design**: Beautiful, responsive UI built with Tailwind CSS v4.

## Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4, Lucide React
-   **Database & Auth**: Supabase
-   **Utilities**: Papaparse (CSV), HTML5-QRCode (Scanning), Sonner (Toasts)

## Getting Started

### Prerequisites

-   Node.js (v20 or later recommended)
-   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Apagafuegos/MangaKeep.git
    cd manga_tracker
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**

    Create a `.env.local` file in the root directory by copying the example file:

    ```bash
    cp .env.example .env.local
    ```

    Update `.env.local` with your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to start the application.

## Scripts

-   `npm run dev`: Starts the development server with webpack.
-   `npm run build`: Builds the application for production.
-   `npm start`: Starts the production server.
-   `npm run lint`: Runs ESLint to check for code quality.

## Project Structure

```
src/
├── app/            # Next.js App Router pages and layouts
│   ├── auth/       # Authentication routes
│   ├── collections/# Collection management pages
│   ├── import/     # Import feature pages
│   ├── login/      # Login page
│   └── ...
├── components/     # Reusable UI components (implied)
├── lib/            # Utility functions and Supabase client (implied)
└── ...
```

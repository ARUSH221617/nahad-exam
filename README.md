# Nahad AI Exam Solver

A specialized AI-powered platform designed to help students study for "Nahad" university exams. The application allows users to upload exam-specific PDFs, uses Advanced RAG (Retrieval-Augmented Generation) to extract answers based strictly on the document, and persists all history (PDFs, questions, and AI-generated answers).

## 🚀 Features

*   **Smart PDF Management**: Upload and store PDF documents using Vercel Blob.
*   **Advanced RAG Pipeline**:
    *   Automatic text extraction and chunking.
    *   Vector embeddings using Google Gemini models.
    *   Semantic search via `pgvector`.
*   **Exam Solver & Chat**:
    *   Context-aware answering engine that cites sources.
    *   Strict adherence to provided document content to minimize hallucinations.
    *   Full support for Persian (Farsi) language and RTL layout.
*   **History & Persistence**:
    *   Save and manage uploaded documents.
    *   Keep a history of all Q&A sessions linked to specific documents.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Database**: PostgreSQL (with `pgvector` extension)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Auth**: [Supabase Auth](https://supabase.com/auth)
*   **AI Engine**: [Google Gemini](https://ai.google.dev/) (via `@google/genai` SDK)
*   **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)

## 📋 Prerequisites

Before you begin, ensure you have the following:

*   **Node.js** (v18 or higher)
*   **PostgreSQL Database** with `vector` extension enabled (e.g., Vercel Postgres, Supabase, or local).
*   **Google AI Studio API Key**: Get one [here](https://aistudio.google.com/).
*   **Supabase Project**: For authentication.
*   **Vercel Blob Token**: For file storage.

## ⚡ Getting Started

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd nahad-ai-exam-solver
    ```

2.  **Install dependencies**

    Due to React 19 peer dependency handling, use the legacy flag:
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Set up Environment Variables**

    Copy the example file to `.env`:
    ```bash
    cp .env.example .env
    ```
    Then open `.env` and fill in your credentials:

    ```env
    GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-key"
    NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    DATABASE_URL="your-postgres-connection-string"
    DIRECT_URL="your-direct-postgres-connection-string"
    BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
    ```

4.  **Initialize the Database**

    Push the Prisma schema to your database:
    ```bash
    npx prisma db push
    ```
    *Note: Ensure your PostgreSQL database has the `vector` extension enabled.*

5.  **Run the Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

*   `app/`: Next.js App Router pages and layouts.
*   `actions/`: Server Actions for backend logic (upload, chat, etc.).
*   `components/`: Reusable UI components.
*   `lib/`: Utility functions, database clients, and AI configuration.
*   `prisma/`: Database schema and configuration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

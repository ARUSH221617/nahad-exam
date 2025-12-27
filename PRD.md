# PRD: Nahad AI Exam Solver

## 1. Project Summary
A specialized platform for the "Nahad" university exams. The app allows students to upload exam-specific PDFs, uses Advanced RAG to extract answers based strictly on the document, and persists all history (PDFs, questions, and AI-generated answers) for future reference.

## 2. Technical Stack
*   **Framework:** Next.js 15 (App Router) + Server Actions.
*   **Language:** TypeScript.
*   **Styling:** Tailwind CSS + Shadcn UI (RTL optimized).
*   **Database (Metadata):** Prisma with SQLite (Local/Dev) or Vercel Postgres (Production).
*   **Vector Database:** Vercel Postgres with `pgvector` (Free tier).
*   **AI Engine:** Google Gemini 1.5 Pro/Flash (via Google AI SDK or Vercel AI SDK).
*   **Embeddings:** Google Generative AI `text-embedding-004`.
*   **File Storage:** Vercel Blob.
*   **PDF Processing:** `langchain` + `pdf-parse`.

---

## 3. Core Features & Requirements

### 3.1 PDF Management & Storage
*   **Upload:** Users upload a PDF via a drag-and-drop zone.
*   **Storage:** Files are stored in **Vercel Blob**.
*   **Persistence:** File URL and metadata (title, upload date) are saved in **SQLite (via Prisma)**.
*   **Library:** A "My Documents" page to see and delete previous PDFs.

### 3.2 Advanced RAG Pipeline (The "Brain")
1.  **Ingestion:**
    *   Extract text from PDF.
    *   **Chunking:** Use `RecursiveCharacterTextSplitter` (chunk size: 1000, overlap: 200).
    *   **Embedding:** Generate vectors for each chunk using Gemini's embedding model.
    *   **Vector Store:** Save vectors into **Vercel Postgres (pgvector)** linked to the `documentId`.
2.  **Retrieval:**
    *   Perform semantic search to find the top 5 most relevant chunks for a question.
3.  **Generation:**
    *   **Prompt Engineering:** "You are an expert in Nahad exams. Using ONLY the provided context from the PDF, answer the multiple-choice or descriptive question. Context: {context}. Question: {question}."
    *   **Language:** Must support Persian perfectly (RTL).

### 3.3 Exam Solver Interface
*   **Dual View:** PDF viewer on the left, Chat/Solver on the right.
*   **Question Input:** Multi-line text area for pasting questions.
*   **History Persistence:** Every question-answer pair must be saved to the database, linked to the specific PDF and User.

---

## 4. Database Schema (Prisma)

```prisma
datasource db {
  provider = "sqlite" // Or "postgresql" for Vercel
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  exams     Exam[]
  documents Document[]
}

model Document {
  id         String   @id @default(cuid())
  name       String
  blobUrl    String
  vectorNamespace String // To filter vectors in pgvector
  createdAt  DateTime @default(now())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  exams      Exam[]
}

model Exam {
  id          String   @id @default(cuid())
  question    String
  answer      String
  references  String   // JSON string of source paragraphs/page numbers
  documentId  String
  document    Document @relation(fields: [documentId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
```

---

## 5. UI/UX Specifications
*   **RTL Support:** Use `dir="rtl"` and Persian fonts (like Vazirmatn).
*   **Loading States:** Use Framer Motion for smooth transitions during "AI is thinking..."
*   **Mobile Optimized:** The sidebar should collapse on mobile to focus on the answer.
*   **Markdown Support:** AI answers should render as Markdown (for bolding and lists).

---

## 6. Implementation Roadmap for Developer

### Phase 1: Infrastructure
1.  Setup Next.js 15 project.
2.  Configure Prisma with SQLite.
3.  Integrate **Vercel Blob** for file uploads.
4.  Setup **Vercel Postgres** and enable `pgvector` extension.

### Phase 2: The RAG Engine
1.  Create a Server Action to:
    *   Read PDF from Vercel Blob.
    *   Split text into chunks.
    *   Generate embeddings via **Gemini API**.
    *   Store in `pgvector`.
2.  Create the Retrieval function using cosine similarity search.

### Phase 3: The Frontend
1.  Build the PDF upload dashboard.
2.  Implement the "Exam Workspace" with a PDF viewer (using `react-pdf-viewer` or iframe).
3.  Connect the Chat interface to the Gemini RAG Server Action.

### Phase 4: History & Search
1.  Build a "Past Exams" page to query the `Exam` model in Prisma.
2.  Allow users to "re-open" an old PDF and see all previous questions asked about it.

---

## 7. Critical Technical Constraints
*   **Context Window:** Ensure the RAG doesn't exceed Gemini's token limit (though Gemini has a huge window, efficiency is key for speed).
*   **Hallucination Control:** The system must strictly say "پاسخ در متن یافت نشد" (Answer not found in text) if the context is missing the answer.
*   **Concurrency:** Use Vercel KV or simple database locks to prevent multiple users from crashing the vector ingestion for the same file.

---

## 8. Environment Variables Needed
```env
DATABASE_URL="file:./dev.db"
POSTGRES_URL="vercel_postgres_with_pgvector_url"
BLOB_READ_WRITE_TOKEN="vercel_blob_token"
GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_key"
```

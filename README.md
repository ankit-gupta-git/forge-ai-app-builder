# Forge: Full-Stack Agentic AI App Generator

Forge is a high-fidelity, AI-powered React application generator that enables users to build, preview, and refine web applications in real-time directly inside the browser. Similar to platforms like Bolt.new and Lovable, Forge handles the end-to-end process of generating React code, resolving dependencies, rendering live previews, and offering agentic multi-file code improvements.

---

## Technical Architecture & Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, TypeScript) | Serverless API routes, Server Actions, and React Server Components (RSC) |
| **Core AI Model** | Gemini 3.5 Flash | Real-time structured code generation with `thinkingConfig` streaming |
| **Agentic SDK** | Cline SDK (`@cline/sdk`) | Multi-file refinement loop utilizing custom autonomous tools (`update_file`, `done_improving`) |
| **Preview Sandbox** | CodeSandbox Sandpack | Real-time code execution, file system management, and iframe preview rendering |
| **Authentication** | Clerk | Multi-tenant user login, subscription tiering, and billing gates |
| **Database** | Postgres (via Supabase) | Persistence layer for users, workspaces, credit balances, and chat history |
| **ORM** | Prisma | Schema modeling and database migrations |
| **Storage** | Supabase Storage (S3 API) | CDN storage for user-uploaded reference images |
| **Security & Limits** | Arcjet | Shielding routes with rate-limiting and bot protection |
| **Styling** | Tailwind CSS v4 & Shadcn UI | Premium dark-themed, glassmorphic, and fully-responsive design tokens |

---

## Core Engineering & Feature Highlights

### 1. Structured Code Generation Pipeline
- **API Endpoint:** `/api/gen-ai-code`
- **Engine:** Gemini 3.5 Flash with live status steps streamed to the user via Server-Sent Events (SSE).
- **Format Enforcement:** Enforces strict JSON responses containing the assistant message, workspace title, file dictionary (`Record<string, { code: string }>`), and validated dependencies.
- **Dependency Guard:** Intercepts package lists and runs registry checks to filter out hallucinated packages prior to client injection.

### 2. Multi-File Agentic Refinements (Improve with Agent)
- **API Endpoint:** `/api/improve` (restricted to Starter & Pro tiers)
- **Engine:** Cline SDK agent loop.
- **Autonomous Tools:**
  - `update_file`: Modifies code blocks across multiple files. Emits changes sequentially via SSE.
  - `done_improving`: Signals completion of tasks and closes the agent lifecycle cleanly using `completesRun: true`.
- **UX Optimization:** Patches are accumulated and applied to client state upon completion, avoiding premature Sandpack remounts during streaming.

### 3. Smart Sandpack Preview Optimization
- **Persistent State:** Uses a smart keying structure (`filePathKey = Object.keys(files).sort().join("|")`). The `SandpackProvider` is only remounted when new files are added or deleted.
- **Atomic Updates:** Individual file updates are applied dynamically using `sandpack.updateFile(path, code)` in a subordinate hook, preventing DOM flashes or preview resets.
- **Tailwind Injector:** Injects Tailwind CSS directly into the preview iframe via a CDN script, ensuring instant style rendering without heavy bundle builds.

### 4. Interactive "Fix with AI" Loop
- **Error Capturing:** Subscribes to Sandpack compiler and runtime error listeners.
- **Self-Healing Loop:** Displays a "Fix with AI" banner on runtime crashes. Clicking the CTA compiles the stack trace, feeds it back to the Gemini generation endpoint, and issues a self-correcting update.

### 5. Credit-Based Billing & State Synchronization
- **Billing Provider:** Clerk `<CheckoutButton>` billing modal.
- **Sync Hook:** Syncs user credits, plans, and profiles on Clerk state changes.
- **Double-Crediting Guard:** Performs atomic transactions inside Prisma (`db.$transaction`) combining workspace upserts with credit decrements, protecting against concurrent credit drain bypasses.

---

## Database Architecture

Prisma models define a clean, indexed structure to manage users and workspaces:

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  name      String
  email     String   @unique
  imageUrl  String   @default("")
  credits   Int      @default(10)
  plan      String   @default("free")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  workspaces Workspace[]
}

model Workspace {
  id        String   @id @default(cuid())
  title     String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages  Json     @default("[]")
  fileData  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

- **`User`:** Persists user authentication IDs, tiering subscription (`free`, `starter`, `pro`), and credit ledger.
- **`Workspace`:** Manages message lists (JSON formats) and generated files/dependencies (`fileData` JSON blob).

---

## Getting Started

### Prerequisites
- **Node.js** v22.0.0 or higher
- **PostgreSQL Database** (e.g., Supabase PostgreSQL)
- **Clerk Account** (for authentication)
- **Google AI Studio Key** (Gemini API access)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ankit-gupta-git/sql-agent-yt-.git
   cd sql-agent-yt-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the project root and populate the following keys:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Supabase Storage & CDN
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Database Connection String
   DATABASE_URL=postgresql://your_db_connection_url

   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key

   # Arcjet Security Key
   ARCJET_KEY=your_arcjet_security_key
   ```

4. **Initialize database schemas:**
   Generate the client library and sync tables:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

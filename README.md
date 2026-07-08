# 🧠 MindWell Connect

## 📌 Overview
MindWell Connect is a mental wellness platform that provides AI-powered assistance, resources, and community support for users.

## 🚀 Features
- 🤖 AI Chatbot (Gemini API)
- 📊 Dashboard
- 💬 Forum & Community
- 🔐 Authentication (Login/Signup)
- 📚 Resources for mental health

## 🛠 Tech Stack
- React + TypeScript
- Vite
- Gemini API

## 📦 Installation

```bash
npm install
npm run dev

🔐 Environment Variables

Create a .env.local file:
VITE_GEMINI_API_KEY=your_api_key_here

📁 Project Structure
components/
services/

🤝 Contributing
Pull requests are welcome!


## 🏗 Architecture

### Application Architecture & Data Flow Matrix
```mermaid
graph TD
    %% Styling Configuration
    classDef clientNode fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff;
    classDef logicNode fill:#0f172a,stroke:#a855f7,stroke-width:2px,color:#fff;
    classDef externalNode fill:#022c22,stroke:#10b981,stroke-width:2px,color:#fff;

    subgraph Client UI Hierarchy [React + TypeScript]
        Dashboard["User Dashboard Component<br/>(Metrics & Mood History)"]:::clientNode
        ChatView["AI Chatbot Panel<br/>(Interactive Messaging View)"]:::clientNode
        ForumView["Forum & Community Hub<br/>(Threads & User Replies)"]:::clientNode
    end

    subgraph Service Coordination Layer [services/]
        AuthService["Auth Service<br/>(Session Verification & Tokens)"]:::logicNode
        AIService["AI / Gemini Service Layer<br/>(Context Engine & Streams)"]:::logicNode
        DataService["State & Resource Coordinator<br/>(React Context / Custom Hooks)"]:::logicNode
    end

    subgraph External Interfaces
        Env["Vite Environment Gateway<br/>.env.local Tracking Instance"]:::externalNode
        Gemini[("Google Gemini API Engine<br/>LLM Response Worker")]:::externalNode
    end

    %% Wiring System Routes
    ChatView -->|Dispatches messages| AIService
    Dashboard -->|Requests tracking arrays| DataService
    ForumView -->|Validates active user session| AuthService
    Env -.->|Injects Key Context at Build Time| AIService
    AIService ===>|Secured POST Payloads| Gemini
    DataService -->|Feeds fresh application state| Dashboard
```

### Sequence Flow: AI Chatbot Request and Context Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User Seeking Support
    participant UI as ChatView Component
    participant Engine as services/services.ts
    participant Gemini as Google Gemini API

    User->>UI: Types query & submits chat form element
    UI->>UI: Append user prompt message locally to the chat array state
    UI->>Engine: Forward message stack + chat history context
    activate Engine
    Engine->>Engine: Inject supportive system prompt context safely
    Engine->>Gemini: Stream/POST contextual payload with VITE_GEMINI_API_KEY
    activate Gemini
    Gemini-->>Engine: Compute and return generative AI text response token
    deactivate Gemini
    Engine-->>UI: Deliver normalized message string payload
    deactivate Engine
    UI->>UI: Append assistant message into array state & re-render view
    User-->>UI: Visualizes conversational guidance bubble
```

### Modular Component Structure & Page Routing Tree

```mermaid
graph TD
    %% Structuring Application Architecture Breakdown
    Root["App.tsx Root Layout Wrapper"] --> Router["React Router Dom / Context Gateway"]
    
    subgraph View Routing Boundaries
        Router --> AuthPage["Authentication Layout<br/>(Login / Signup Panels)"]
        Router --> DashboardMain["Core User Dashboard<br/>(Data Tracking Insights)"]
        Router --> Forum["Community Forum Space<br/>(Topics & Post Cards)"]
        Router --> Resources["Mental Health Library<br/>(Articles & Support Hotlines)"]
    end

    subgraph Shared Component Directory
        DashboardMain --> MiniBot["Floating AI Chatbot Component"]
        Forum --> ForumCard["Thread Metadata Card Node"]
        Resources --> FilterTabs["Category Interactive Tabs Selection"]
    end
```

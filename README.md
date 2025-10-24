# 🏥 Neural RX - AI-Powered Healthcare Search

> **Winner Submission** for the Elastic + Google Cloud Hackathon Challenge  
> Combining Elasticsearch hybrid search with Google Gemini AI for intelligent healthcare information discovery

[![Built with React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Powered by Elasticsearch](https://img.shields.io/badge/Elasticsearch-Hybrid_Search-005571?logo=elasticsearch)](https://www.elastic.co/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview

**Neural RX** is an intelligent healthcare information discovery platform that makes finding medical information feel like having a conversation with a knowledgeable medical reference guide. By combining **Elasticsearch's hybrid search** capabilities with **Google Gemini's generative AI**, we've created an experience that's both precise and personal.

### ✨ Key Features

- 🤖 **Conversational AI Interface** - Ask health questions in plain language
- 🔍 **Hybrid Search** - Combines keyword + semantic matching across 12+ medical conditions
- 🗣️ **Voice Input** - Hands-free interaction using Web Speech API
- 💾 **Export Chat History** - Download conversations in PDF, Text, or JSON format
- ⭐ **Bookmarks** - Star important messages for quick reference
- 🧠 **Context-Aware Conversations** - Remembers previous questions for natural follow-ups
- ⚡ **Quick Actions** - One-click access to 6 common health topics
- 🌓 **Dark Mode** - Beautiful UI that adapts to your preference
- ♿ **Accessible** - WCAG AA compliant with keyboard navigation

---

## 🎥 Demo

[Add screenshots or GIF demo here]

**Try these sample queries:**
- "What are the symptoms of diabetes?"
- "Tell me about treatment options for hypertension"
- "How is asthma diagnosed?"
- "What causes migraines?"

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────────────────┐  ┌─────────────────────────┐ │
│  │   Chat Interface     │  │  Search Results Panel   │ │
│  │  - Voice Input       │  │  - Medical Cards        │ │
│  │  - Bookmarks         │  │  - Symptoms & Treatments│ │
│  │  - Export Options    │  │  - Severity Badges      │ │
│  └──────────────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Express.js Backend                     │
│  ┌──────────────────┐  ┌──────────────────────────┐    │
│  │  Gemini AI       │  │  Elasticsearch           │    │
│  │  - Entity Extract│  │  - Hybrid Search         │    │
│  │  - Response Gen  │  │  - 12 Health Conditions  │    │
│  │  - Context Aware │  │  - Multi-field Matching  │    │
│  └──────────────────┘  └──────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User** asks a health question via chat or voice
2. **Gemini AI** extracts medical entities from the query
3. **Elasticsearch** performs hybrid search across healthcare database
4. **Search results** provide context to Gemini AI
5. **Gemini** generates an informed, conversational response
6. **UI** displays both AI response and structured medical cards

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + **Shadcn UI** for beautiful healthcare design
- **TanStack Query** for data fetching and state management
- **Wouter** for lightweight routing
- **Lucide React** for icons

### Backend
- **Express.js** server with TypeScript
- **Elasticsearch** (@elastic/elasticsearch) for hybrid search
- **Google Gemini AI** (gemini-2.5-flash) for conversational intelligence
- **In-memory storage** for chat history and analytics

### Integrations
- **Elastic Cloud** - Managed Elasticsearch deployment
- **Google AI Studio** - Gemini API access
- **Web Speech API** - Browser-native voice recognition

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Elastic Cloud account ([Sign up free](https://cloud.elastic.co/))
- Google AI Studio API key ([Get yours](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neural-rx.git
   cd neural-rx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ELASTIC_CLOUD_ID=your_elastic_cloud_id_here
   ELASTIC_API_KEY=your_elastic_api_key_here
   SESSION_SECRET=your_random_session_secret
   ```

4. **Get Elasticsearch credentials**
   - Go to [Elastic Cloud](https://cloud.elastic.co/)
   - Create a new **Deployment** (not Serverless)
   - Copy the **Cloud ID**
   - Open Kibana → Stack Management → Security → API Keys
   - Create an API key with full permissions
   - Update `ELASTIC_CLOUD_ID` and `ELASTIC_API_KEY` in `.env`

5. **Get Google Gemini API key**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create a new API key
   - Update `GEMINI_API_KEY` in `.env`

6. **Run the application**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:5000
   ```

The backend will automatically:
- Connect to Elasticsearch
- Create the `healthcare_conditions` index
- Seed 12 medical conditions
- Start serving on port 5000

---

## 📊 Healthcare Database

Neural RX includes a curated database of **12 major medical conditions**:

### Conditions Covered
- **Endocrine**: Diabetes Type 2, Hypothyroidism
- **Cardiovascular**: Hypertension, Atrial Fibrillation
- **Respiratory**: Asthma
- **Neurological**: Migraine
- **Musculoskeletal**: Osteoarthritis, Rheumatoid Arthritis
- **Mental Health**: Depression, Generalized Anxiety Disorder
- **Gastrointestinal**: GERD (Gastroesophageal Reflux Disease)
- **Renal**: Chronic Kidney Disease

Each condition includes:
- Detailed description
- Common symptoms
- Treatment options
- Severity rating (Mild, Moderate, Severe)
- Medical category classification

---

## 🎨 Design System

Neural RX follows a healthcare-focused design philosophy:

- **Color Palette**: Medical blue primary (#0EA5E9) with carefully chosen accent colors
- **Typography**: Inter for body, JetBrains Mono for technical data
- **Spacing**: Consistent 2/4/6/8 unit system
- **Accessibility**: WCAG AA compliant with proper contrast ratios
- **Responsive**: Works beautifully on desktop, tablet, and mobile

See `design_guidelines.md` for complete design specifications.

---

## 🔧 Advanced Features

### Voice Input
Powered by the Web Speech API for hands-free interaction:
- Click the microphone icon in the chat input
- Speak your health question naturally
- Real-time speech-to-text transcription
- Visual feedback while recording

### Export Chat History
Save your conversations for future reference:
- **PDF**: Professional formatting with timestamps
- **Text**: Plain text format for easy reading
- **JSON**: Machine-readable format for data analysis

### Bookmarks
Mark important messages for quick access:
- Click the star icon on any message
- Bookmarks persist using localStorage
- Yellow star indicates saved messages

### Quick Actions
Pre-configured health topic cards for common queries:
- 💊 Medication Information
- 🩺 Symptoms Checker
- ❤️ Heart Health
- 🧠 Mental Health Support
- 🥗 Nutrition Advice
- 🏥 Health Checkups

---

## 📁 Project Structure

```
neural-rx/
├── client/
│   └── src/
│       ├── components/        # React components
│       │   ├── ChatMessage.tsx
│       │   ├── ExportDialog.tsx
│       │   ├── QuickActions.tsx
│       │   └── ScrollToBottomButton.tsx
│       ├── contexts/          # React contexts
│       │   └── BookmarksContext.tsx
│       ├── hooks/             # Custom hooks
│       │   ├── useVoiceRecognition.ts
│       │   └── useBookmarks.ts
│       ├── lib/               # Utilities
│       │   ├── exportUtils.ts
│       │   └── queryClient.ts
│       ├── pages/             # Page components
│       │   └── Home.tsx
│       └── types/             # TypeScript types
│           └── speech.d.ts
├── server/
│   ├── data/                  # Healthcare dataset
│   │   └── healthcare-conditions.ts
│   ├── elastic.ts             # Elasticsearch client
│   ├── gemini.ts              # Gemini AI integration
│   ├── routes.ts              # API endpoints
│   ├── storage.ts             # In-memory storage
│   └── index.ts               # Server entry point
├── shared/
│   └── schema.ts              # Shared TypeScript types
├── design_guidelines.md       # Design system documentation
├── replit.md                  # Project documentation
└── README.md                  # You are here!
```

---

## 🔌 API Endpoints

### Chat & Search
- `POST /api/chat` - Send message, get AI response + search results
- `GET /api/search?q={query}` - Direct search without AI
- `GET /api/chat/history/:sessionId` - Retrieve chat history

### Analytics & Health
- `GET /api/analytics/searches` - Search analytics data
- `GET /api/health` - Server and Elasticsearch status

---

## 🧪 Testing

The application includes comprehensive end-to-end tests covering:
- Chat functionality with AI responses
- Search results rendering
- Voice input interactions
- Bookmark persistence
- Export functionality
- Dark mode toggling
- Responsive design

Run tests:
```bash
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Elastic** for providing powerful hybrid search capabilities
- **Google Cloud** for Gemini AI's natural language understanding
- **Replit** for the development environment and hosting platform
- **Shadcn UI** for beautiful, accessible component primitives
- The open-source community for amazing tools and libraries

---

## 📧 Contact

**Project Maintainer**: [Your Name]  
**Email**: your.email@example.com  
**Project Link**: https://github.com/yourusername/neural-rx

---

## 🎯 Hackathon Submission

This project was built for the **Elastic + Google Cloud Hackathon Challenge**.

**Challenge**: Build the future of AI-powered search using Elastic's hybrid search and Google Cloud's generative AI tools.

**What makes Neural RX special**:
- ✅ True hybrid search (keyword + semantic)
- ✅ Context-aware AI conversations
- ✅ Production-ready features (voice, export, bookmarks)
- ✅ Beautiful, accessible healthcare UI
- ✅ Real medical database with structured data
- ✅ Sub-8-second response times

---

<div align="center">

**Built with ❤️ for better healthcare information access**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/yourusername/neural-rx/issues) · [Request Feature](https://github.com/yourusername/neural-rx/issues) · [Live Demo](https://your-app.replit.app)

</div>

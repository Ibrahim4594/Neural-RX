# Design Guidelines: AI-Powered Healthcare Search Application

## Design Approach

**Selected Approach:** Hybrid Design System (Material Design + Apple HIG)
- Material Design for information density, card-based layouts, and clear hierarchy
- Apple HIG principles for clean minimalism and focused user experience
- Healthcare-specific patterns from professional medical software (Epic, Cerner)

**Justification:** Healthcare applications demand trustworthy, accessible, and efficient interfaces. This is a utility-focused application where clarity and usability are paramount over visual flair.

---

## Typography System

### Font Families
- **Primary:** Inter or Roboto (via Google Fonts) - clean, highly legible for extended reading
- **Monospace:** JetBrains Mono - for medical codes, IDs, technical data
- **Limit:** 2 font families maximum

### Hierarchy
- **Page Titles:** text-3xl font-semibold (medical condition names, main headings)
- **Section Headers:** text-xl font-medium (search results, chat sections)
- **Body Text:** text-base font-normal leading-relaxed (descriptions, explanations)
- **Medical Terms:** text-base font-medium (highlighted terminology)
- **Metadata:** text-sm (timestamps, source citations, relevance scores)
- **Labels:** text-xs uppercase tracking-wide font-medium (form labels, tags)

---

## Layout System

### Spacing Primitives
Use Tailwind units of **2, 4, 6, and 8** consistently:
- **Micro spacing:** p-2, gap-2 (tight groupings, tags)
- **Standard spacing:** p-4, gap-4 (card padding, component spacing)
- **Section spacing:** p-6, gap-6 (between major sections)
- **Large spacing:** p-8, gap-8 (page margins, major separators)

### Grid Structure
- **Main Layout:** Two-panel split (60/40 or 55/45)
  - Left: Chat interface (conversation area)
  - Right: Search results panel (contextual information)
- **Responsive:** Stack to single column on mobile (chat first, results accessible via tab/toggle)
- **Max Width:** max-w-7xl for application container
- **Sidebar Width:** w-80 for potential navigation/filters sidebar

---

## Component Library

### Navigation
- **Top Navigation Bar:**
  - Fixed header (sticky top-0)
  - Application logo/name (left)
  - Global search input (center-left)
  - User profile/settings (right)
  - Height: h-16
  - Shadow: shadow-sm for subtle depth

### Chat Interface (Primary Component)
- **Message Container:**
  - User messages: align-self-end, max-w-2xl
  - AI responses: align-self-start, max-w-3xl
  - Spacing: space-y-4 between messages
  - Padding: p-4 within each message bubble
  
- **Message Bubbles:**
  - Rounded corners: rounded-2xl
  - User messages: slightly smaller, concise
  - AI responses: generous padding, structured content
  
- **Input Area:**
  - Fixed bottom position (sticky bottom-0)
  - Multi-line textarea with rounded-xl border
  - Send button integrated (icon-only, positioned right)
  - Height: Auto-expand with max-h-32
  - Placeholder: "Ask about medical conditions, symptoms, treatments..."

### Search Results Panel
- **Result Cards:**
  - Card structure: rounded-lg, p-6, shadow-sm
  - Header: Medical term/condition (text-lg font-semibold)
  - Relevance score: Small badge (text-xs, px-2 py-1, rounded-full)
  - Description: text-sm leading-relaxed, line-clamp-3
  - Metadata row: Flex layout with source, category, date
  - Spacing: space-y-4 between cards
  
- **Highlighted Entities:**
  - Medical terms: Subtle emphasis with font-medium
  - No background highlights (maintain readability)
  - Optional underline decoration on hover

### Forms & Inputs
- **Search Input:**
  - Height: h-12
  - Rounded: rounded-lg
  - Padding: px-4
  - Border: border-2 (focus state has enhanced border)
  - Icon: Search icon (left side, ml-3)
  
- **Filters/Dropdowns:**
  - Select inputs: h-10, rounded-md
  - Multi-select chips: Flex wrap, gap-2
  - Chip style: px-3 py-1, rounded-full, text-sm

### Data Display
- **Information Panels:**
  - Structured data: Definition list (dl/dt/dd) format
  - Key-value pairs: Grid layout (grid-cols-2 gap-4)
  - Symptoms list: Unordered list with custom markers
  - Treatment options: Numbered list with clear hierarchy
  
- **Medical Entity Tags:**
  - Inline badges: px-2 py-0.5, rounded, text-xs
  - Categories: Conditions, Symptoms, Treatments, Medications
  - Subtle styling to differentiate types

### Loading States
- **Skeleton Screens:**
  - Animate pulse for loading cards
  - Preserve layout structure during load
  - Use for: Search results, chat responses
  
- **Typing Indicator:**
  - Three-dot animation for AI response generation
  - Positioned in chat bubble format

---

## Images

### Hero Section
**Large Hero Image:** No - This is an application interface, not a marketing site. Focus on immediate functionality.

### Contextual Images
- **Medical Illustrations:** Small inline images (w-16 h-16 or w-24 h-24) for anatomical references in search results
- **Icon System:** Use Heroicons (via CDN) exclusively - outline style for UI chrome, solid style for active states
- **Avatars:** Circle avatars (w-10 h-10) for user profile, AI assistant icon

### Image Placement
- Inline within search result cards (float right, mr-4)
- Small thumbnail previews for medical diagrams
- All images: rounded-lg, object-cover

---

## Accessibility & Interaction

### Focus Management
- Clear focus indicators: ring-2 ring-offset-2
- Keyboard navigation: Tab order follows conversation flow
- Skip links: "Skip to results" for screen readers

### Interactive States
- **Buttons:** Consistent transform scale-[0.98] on active
- **Links:** Underline decoration on hover
- **Cards:** Subtle shadow-md on hover
- **No custom hover for buttons on images** (per guidelines)

### ARIA Labels
- Chat messages: aria-label with "User message" / "AI response"
- Search results: aria-describedby for relevance scores
- Form inputs: Properly associated labels

---

## Animation (Minimal)

- **Page Transitions:** None (instant navigation)
- **Message Appearance:** Subtle fade-in (duration-200) for new chat messages
- **Search Results:** Stagger animation optional for initial load (delay-[50ms] increments)
- **Loading States:** Pulse animation only
- **No scroll-triggered animations**

---

## Responsive Behavior

### Breakpoints
- **Mobile (< md):** Single-column stack, full-width chat
- **Tablet (md-lg):** Begin side-by-side layout, condensed right panel
- **Desktop (lg+):** Full two-panel experience with optimal widths

### Mobile Adaptations
- Chat input: Fixed bottom with safe-area-inset padding
- Results: Accessible via slide-up panel or tab navigation
- Reduced padding: p-4 instead of p-6 for cards
- Font scaling: Slightly smaller base size (text-sm becomes default)

---

## Key Design Principles

1. **Trust Through Clarity:** Medical information requires unambiguous presentation
2. **Scannable Hierarchy:** Users should quickly parse search results and conversations
3. **Generous Whitespace:** Prevent cognitive overload in information-dense displays
4. **Consistent Patterns:** Repetitive UI elements build user confidence
5. **Accessible Always:** WCAG AA minimum, AAA preferred for text contrast

This comprehensive design creates a professional, trustworthy healthcare search application that prioritizes user needs and information clarity.
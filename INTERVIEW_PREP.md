# TechVault — Technical Interview Cheat Sheet (Quick Prep)

> **Elevator Pitch (30-second answer)**:
> *"TechVault is a curated, privacy-first technical learning platform designed to aggregate world-class computer science curricula and high-yield one-shot revision marathons into structured learning paths. Built on a full-stack TypeScript architecture (React + Node.js/Express + MongoDB), it delivers a tactile, light Neumorphic clay UI, an automated 92% video completion tracking engine using the YouTube IFrame API, and a Zero-Auth, zero-friction local storage persistence model."*

---

## 1. Core Architectural Pillars & Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│                       TECHVAULT ARCHITECTURE                │
├───────────────────────────────┬─────────────────────────────┤
│      Frontend (Vercel)        │      Backend (Render)       │
│  • React 18 + Vite + TS       │  • Node.js + Express + TS   │
│  • Pure Neumorphism (CSS)     │  • MongoDB Atlas + Mongoose │
│  • YouTube IFrame Player API  │  • Modular RESTful Routing  │
│  • LocalStorage Zero-Auth     │  • Helmet & CORS Protection │
└───────────────────────────────┴─────────────────────────────┘
```

### Key Differentiators to Highlight
1. **Zero-Auth Architecture**: No login walls, passwords, or tracking cookies. Course progress, lesson completion checkboxes, and bookmarks are seamlessly managed on the client (`localStorage`), respecting user privacy and removing onboarding drop-off.
2. **True Neumorphism Clay Design System**: Hand-crafted CSS convex raised cards (`neu-card`), concave sunken wells (`neu-inset`), debossed text shadows (`neu-text-indent`), and an electric violet gradient accent (`#7047eb` to `#9066ff`).
3. **Automated 92% Progress Engine**: Instead of static video embeds, we integrated the YouTube IFrame API to poll playback progress in real-time, automatically checking off lessons and calculating aggregate completion when the user finishes $\ge 92\%$ of a video.

---

## 2. Technical Stack Breakdown

| Layer | Technologies & Libraries | Why We Chose It |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons | Ultra-fast HMR builds, strong type contracts, utility-first styling with custom Neumorphic tokens. |
| **Backend** | Node.js, Express.js, TypeScript | Scalable event-driven REST API, end-to-end type safety between client and server models. |
| **Database** | MongoDB Atlas, Mongoose ODM | Flexible hierarchical schemas (nested modules $\rightarrow$ lessons $\rightarrow$ resources) and compound indexing. |
| **Integrations** | YouTube IFrame Player API | Enables programmatic playback control, duration measurement, and background progress hooks without hosting heavy video files. |
| **Deployment** | Vercel (SPA Frontend) + Render (Node.js API) | Optimized edge CDN routing with single-page app rewrites paired with containerized cloud API hosting. |

---

## 3. Database Schema Design (Key Models)

### `Course` Model (Hierarchical Curricula)
- **Fields**: `title`, `slug`, `instructor`, `description`, `thumbnail`, `level`, `language`, `totalLessons`, `totalDuration`, `isFeatured`.
- **Nested `modules` array**:
  - `title`, `description`, `order`.
  - **`lessons` array**: `title`, `youtubeVideoId`, `duration`, `important` (High-Yield flag), `resources` (`title`, `url`).

### `OneShot` Model (Revision Marathons)
- **Fields**: `title`, `slug`, `instructor`, `youtubeVideoId`, `duration`, `level`, `subjectSlug`, `tags`, `isFeatured`.

### `Subject` & `Category` Models
- Categories group Technical Disciplines (e.g. *Computer Science*, *Data Science & AI*, *System Design*).
- Subjects have slugs, icons, and popular topic tags.

---

## 4. Top Technical Challenges & How You Solved Them

### Challenge 1: Video Reload Bug on Progress Completion
- **Problem**: When a video crossed 92%, `onComplete` was called, updating the React state (`progressMap`). This caused parent re-renders that recreated the callback, which triggered `useEffect` cleanup and re-instantiated the YouTube player from second 0.
- **Solution**: Decoupled callback execution from player initialization using **`useRef` callback handles** (`onCompleteRef.current`). The player's lifecycle now depends strictly on `videoId` and `isPlaying`, ensuring uninterrupted continuous playback while updating progress in the background.

### Challenge 2: Neumorphic Layout Shifts in Dropdowns
- **Problem**: Expanding pills caused adjacent layout shifts and sudden visual snapping when closing.
- **Solution**: Implemented a locked 44px header with matched fixed widths (`w-52 sm:w-56`), smooth CSS `max-height` transitions (`320ms cubic-bezier(0.4, 0, 0.2, 1)`), and quick 180ms opacity fades. This created fluid expansion and retraction without jitter.

### Challenge 3: Responsive Floating Neumorphic Sculptures
- **Problem**: Large flanking decorative relief discs caused horizontal scrollbars and got clipped by page padding.
- **Solution**: Configured root container `overflow-x-clip` with inner `overflow-visible` and calibrated absolute coordinate transforms (`-left-28 2xl:-left-36`), preserving 3D relief depths without breaking responsiveness.

---

## 5. Most Likely Interview Questions & Star Answers

### Q1: *"Why did you choose a Zero-Auth model instead of JWT or OAuth?"*
> **Answer**: *"For an educational library, barrier to entry is the biggest friction point. By using a Zero-Auth model with local storage and optimistic UI updates, users get instantaneous progress tracking and bookmarks without signup fatigue. If enterprise cloud sync is needed later, the data contract is already modeled to migrate local state into a user profile schema with a single sync endpoint."*

### Q2: *"How does the 92% video completion tracking work under the hood?"*
> **Answer**: *"We load the official YouTube IFrame API dynamically and bind player event listeners. When the video enters the `PLAYING` state (`event.data === 1`), a 1-second interval polls `player.getCurrentTime()` against `player.getDuration()`. When (currentTime / duration) >= 0.92, we fire an idempotent completion event that flags the lesson in localStorage, recalculates course completion percentage, and updates the progress bar without stopping video playback."*

### Q3: *"How do you handle API performance and query efficiency?"*
> **Answer**: *"We implemented text and slug indexing on MongoDB models, pagination on courses and one-shots, search query aggregation pipelines, and production security middleware like Helmet and CORS. For the frontend, Vite code-splits vendor chunks and caches assets via HTTP headers."*

---

## 6. 60-Second Interview Walkthrough Outline
1. **Introduction**: *"I built TechVault, a full-stack technical learning platform for structured courses and one-shots."*
2. **Demo Highlight**: Show the homepage Neumorphism aesthetics $\rightarrow$ Navigate to a Course $\rightarrow$ Select a lesson $\rightarrow$ Fast forward to 92% to show the automated checkmark and progress bar update $\rightarrow$ Show filter smooth animations.
3. **Architecture Summary**: React 18 frontend on Vercel connecting to Express/MongoDB on Render with Zero-Auth client caching.
4. **Key Takeaway**: Strong UI engineering paired with real-world API integration and resilient state management.

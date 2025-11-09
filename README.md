# Hackathon TeamUp

Hackathon TeamUp is a modern, AI-powered platform designed to help developers, designers, and project managers find the perfect teammates for their next hackathon. It streamlines the team-finding process with intelligent matching, real-time communication, and integrated project management tools, all enhanced with cutting-edge generative AI.

![Hackathon TeamUp Screenshot](https://storage.googleapis.com/aifire-prompt-gallery/4e001861-1979-4560-84a9-258957863d27.png)

## ✨ Features

This application is packed with features to facilitate every step of the hackathon journey, from finding teammates to collaborating on a project.

### 👤 Profile & User Management
- **Guided Onboarding:** A smooth, multi-step process for new users to build a comprehensive profile, covering personal details, skills, project history, and hackathon experience.
- **Detailed User Profiles:** View rich profiles for other users, showcasing their bio, skills, experience, and past projects.
- **Full Profile Editing:** Users can view and edit their own profile at any time after the initial onboarding.
- **Secure Authentication:** A complete (though simplified for this demo) login and logout flow to manage user sessions.

### 🤖 AI-Powered Matchmaking & Discovery
- **AI-Ranked "For You" Page:** A swipe-based discovery feed where potential teammates are intelligently ranked and suggested by an AI based on compatibility.
- **Intelligent Matching System:** Express interest in a user's profile to create a "match" and enable communication.
- **AI-Powered Match Summaries:** On the "Your Matches" page, trigger an AI to analyze all potential candidates for a team opening and highlight the most suitable one with a detailed summary.
- **AI Profile Verification:** Use an AI tool on any user's profile to check for completeness and potential red flags, helping to verify the legitimacy of potential teammates.
- **New Match Notifications:** The "Your Matches" button changes color and shows a notification dot when a new match is made, resetting after it has been viewed.

### 🤝 Team Building & Project Collaboration
- **Team Openings:** Users can create, view, edit, and delete "Team Openings" for specific hackathons, detailing the project idea, required roles, and tech stack.
- **Team Formation & Management:** Opening creators can approve members who have matched, officially adding them to the team, and can also remove members if needed.
- **Group Chat & Task Management:**
  - Once a team is formed, a dedicated group chat is automatically created for all approved members.
  - Within the group chat, team members can manage a shared to-do list by creating, editing, and assigning tasks.
- **Teammate Rating System:** A star-based rating system where users can rate their teammates after collaborating. The average rating is displayed on each user's profile to build trust and reputation.

### 💬 Communication & AI Tools
- **Direct & Group Messaging:** The app supports both one-on-one direct messages with matches and group chats for formed teams.
- **AI-Generated Icebreakers:** In any chat, users can click a button to have an AI generate a personalized conversation starter to break the ice.
- **AI Content Moderation:** All chat messages are automatically scanned by an AI to detect and censor inappropriate language, promoting a professional and respectful environment.
- **"Learn" Page Chatbot:** An AI assistant that can:
  - Suggest interesting hackathon problem statements based on a domain (e.g., "healthcare").
  - Analyze a user's problem statement and provide a detailed breakdown, including a potential solution, tech stack, and feasibility analysis.
  - Answer general questions about hackathons.

### 🎨 UI & UX
- **Fully Responsive Design:** The application features a mobile-first design that includes a bottom navigation bar for small screens and adapts to a desktop-friendly sidebar layout.
- **Light & Dark Mode:** Users can toggle between light and dark themes in the settings menu.
- **Toast Notifications:** The app uses non-intrusive pop-up notifications for key actions like creating a match, encountering an error, or receiving AI suggestions.

## 🛠️ Tech Stack

This project is built with a modern, production-ready tech stack:

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
- **Generative AI:** [Genkit (by Firebase)](https://firebase.google.com/docs/genkit)
- **Authentication & Data:** Mocked in-memory data using browser `localStorage` (designed for easy integration with [Firebase Auth](https://firebase.google.com/docs/auth) and [Firestore](https://firebase.google.com/docs/firestore)).

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- An active Google AI Studio API Key.
- `npm` or `yarn`.

### Installation & Running

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/hackathon-teamup.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd hackathon-teamup
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

3.  **Set Up Environment Variables**
    The AI features in this app are powered by Genkit and Google AI. You'll need to configure your Google AI Studio API key.

    - Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create a new API key.
    - Create a file named `.env` in the root of the project.
    - Add your API key to the `.env` file:
      ```
      GEMINI_API_KEY=your_google_ai_studio_api_key
      ```

4.  **Run the Application**
    You need to run two processes in separate terminals: the Next.js frontend and the Genkit AI backend.

    - **Terminal 1: Start the Genkit Server**
      This runs the AI flows that power the app's intelligent features.
      ```sh
      npm run genkit:dev
      ```
      This will start the Genkit development server, typically on port 4000, and provide a UI for inspecting your AI flows.

    - **Terminal 2: Start the Next.js Development Server**
      This runs the user interface and the main application logic.
      ```sh
      npm run dev
      ```

5.  **Open the App**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application is now running! You can start by creating a profile through the onboarding flow and exploring the various features.

# ai-board

A modern AI-powered boardroom and persona management platform.

## Features
- Boardroom dashboard for managing AI conversations
- Persona library for custom AI personalities
- Authentication and user management
- Built with React, Node.js, Express, Prisma, and Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Anirach/ai-board.git
   cd ai-board
   ```
2. Install dependencies for both frontend and backend:
   ```sh
   npm install
   cd backend && npm install
   ```
3. Set up your environment variables:
   - Copy `backend/.env.example` to `backend/.env` and fill in the required values.

4. Run the development servers:
   - In the project root (for frontend):
     ```sh
     npm run dev
     ```
   - In the `backend` folder (for backend):
     ```sh
     npm start
     ```

## Project Structure
- `src/` - Frontend React app
- `backend/` - Node.js/Express backend with Prisma ORM
- `public/` - Static assets

## License
MIT

---

For more details, see the code and comments in each directory.

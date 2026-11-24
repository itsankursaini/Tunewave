# Tunewave – Frontend

React + Vite frontend for the complete-backend music API.

## Run

```bash
cd frontend
npm install
npm run dev
```

Opens on http://localhost:5173. The backend must be running on port 3000.
Requests to `/api/*` are proxied to `http://localhost:3000` (see `vite.config.js`),
so the auth cookie works without any CORS setup.

## Folder structure

```
src/
  api/          axios instance + all API calls
  components/   Navbar, Player, SongRow, Loader, EmptyState, ProtectedRoute
  context/      AuthContext (logged-in user), PlayerContext (audio playback)
  pages/        Login, Register, Home, Albums, AlbumDetails, ArtistDashboard, NotFound
  utils/        small helpers
```

## Roles

- **user (listener)**: browse songs, albums, play music
- **artist**: upload songs, create albums (Studio page)

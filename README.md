# mSync

Lightweight Node + React app to sync Youtube playlists with local folders.

## Project Structure

```
msync
├── apps
│   ├── api              # Node.js backend using Express
│   └── web              # React frontend
├── packages
│   └── msync-api-types  # Shared API types and schemas
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- pnpm (version 6 or higher)

### Installation

1. Allow build scripts: `pnpm approve-builds`
2. Install dependencies: `pnpm install`


### Running the Applications

#### API

To start the API server, navigate to the `apps/api` directory and run: `pnpm dev`

#### Web

To start the React application, navigate to the `apps/web` directory and run: `pnpm dev`

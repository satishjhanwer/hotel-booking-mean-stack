# Hotel Booking MEAN Stack

A full-stack hotel booking app with an Angular client and an Express API backed by MongoDB.

## Stack

- Angular 22.2, Angular Material 22.2, and Tailwind CSS 4.3
- TypeScript 6.0
- Node.js 22.22.3+, 24.15.0+, or 26+ (required by the Angular 22 toolchain)
- Express 5.3 and Mongoose 9.11
- MongoDB 8
- Yarn 4.18.1 workspaces

## Prerequisites

Install a supported Node.js version, Yarn 4.18.1, and a running MongoDB instance.

## Setup

1. Clone the repository and install the workspace dependencies from the repository root:

   ```sh
   git clone https://github.com/satishjhanwer/hotel-booking-mean-stack.git
   cd hotel-booking-mean-stack
   yarn install
   ```

2. Configure `packages/backend/.env` with your local MongoDB connection string and a private JWT secret:

   ```env
   DB_URI=mongodb://127.0.0.1:27017/hotel_booking
   JWT_SECRET=replace-with-a-local-secret
   ```

3. Seed the local database before starting the app:

   ```sh
   yarn seed
   ```

   The seed command adds four sample hotels and two local accounts. It is safe to run again: existing records with the seed identifiers are left unchanged. Default logins are `admin@hotelbooking.com` / `HotelAdmin123!` and `guest@hotelbooking.com` / `Guest123!`. You can override them with `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_GUEST_EMAIL`, and `SEED_GUEST_PASSWORD` in the backend environment.

4. Start both applications from the repository root:

   ```sh
   yarn start
   ```

   Angular runs at [http://localhost:4200](http://localhost:4200), and the API runs at [http://localhost:3000](http://localhost:3000).

## Workspace commands

Run these from the repository root:

| Command | Purpose |
| --- | --- |
| `yarn start` | Start the backend and frontend together |
| `yarn seed` | Add sample hotels and local accounts to MongoDB |
| `yarn workspace backend dev` | Start only the backend in development mode |
| `yarn workspace backend build` | Compile the backend TypeScript |
| `yarn workspace frontend start` | Start only the Angular development server |
| `yarn workspace frontend build` | Build the Angular frontend |

## Project layout

- `packages/backend`: Express routes, Mongoose models, auth middleware, and seed script
- `packages/frontend`: Angular app, Tailwind/PostCSS setup, and global styles

The frontend uses `packages/frontend/postcss.config.json` with the Tailwind 4 PostCSS plugin.

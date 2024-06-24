# F1-Dashboard

A web application for replaying Formula 1 telemetry data. Track driver positions, rankings, and track status through an interactive timeline.

## Project Structure

This project is a monorepo, divided into two main parts:

- **Client (Frontend):** Built with Next.js
- **Server (Backend):** Built with Bun, Hono, and MongoDB

## Setup

To run F1-Dashboard locally, ensure you have Docker and either Npm or Bun installed on your machine.

1. Rename `.env.example` files in the root and client folders to `.env` and adjust the values as needed.
2. Start the application by running `npm start` or `bun start`.
3. Seed the database by running `npm cmd` or `bun cmd`, followed by `bun seed`. Note that this process may take over 10 minutes to complete.
4. Visit `http://localhost:3000` in your web browser to access the application.

### Notice

This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V

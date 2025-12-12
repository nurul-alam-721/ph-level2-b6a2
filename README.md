
# Vehicle Rental System – Backend API

A complete backend API for managing users, vehicles, and bookings in a vehicle rental service.  
Built using **Node.js**, **Express.js**, **TypeScript**, and **PostgreSQL**.

## Live API URL
> https://ph-b6-a2-level-2.vercel.app/

## Features
- User management (admin & customer)
- Vehicle CRUD
- Booking creation, cancellation, return marking
- Auto-return by system
- JWT authentication
- Role-based authorization

## Tech Stack
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT
- bcrypt

## Project Structure
src/
├── config/
├── middlewares/
├── modules/
├── ├── auth/
│   ├── users/
│   ├── vehicles/
│   ├── bookings/
├── types/
│   ├── app.ts
│   ├── server.ts


## API Endpoints
  Auth, Users, Vehicles, Bookings endpoints.

## Installation & Setup
Clone → Install → Create .env → Init DB → Run server.

## Testing
Use Postman with Bearer token.

☀️ UrjaLink - Solar Energy Marketplace
UrjaLink is a modern, full-stack web application that provides a platform for the peer-to-peer trading of solar energy. It features a clean, responsive user interface and a robust backend to handle user authentication, energy listings, and transaction histories.

This project serves as the foundational centralized version, with plans to evolve into a fully decentralized application (DApp) on the blockchain.

✨ Core Features
User Authentication: Secure signup and login system for users.

Seller Dashboard: Allows users to list their excess solar energy for sale by specifying the amount and price.

Buyer Marketplace: Users can browse and purchase available energy listings from other users in real-time.

Dynamic Transaction History: Provides a user-specific log of all past energy purchases and sales.

Responsive UI: A modern and intuitive user interface built with React, Tailwind CSS, and shadcn/ui that works on any device.

🛠️ Tech Stack
Frontend:

React (with Vite)

TypeScript

Tailwind CSS for styling

shadcn/ui for UI components

@tanstack/react-query for managing server state and data fetching.

Backend:

Node.js with Express.js for the server.

MongoDB with Mongoose as the database for users, listings, and transactions.

bcryptjs for secure password hashing.

JWT (JSON Web Tokens) for managing user sessions.

🚀 Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js: Version 18.x or higher is recommended.

MongoDB: Ensure you have MongoDB Community Server installed and running locally on your machine.

Installation & Setup
Clone the repository:

git clone [https://github.com/NitishkBiswal/urjalink-solar-flow.git](https://github.com/NitishkBiswal/urjalink-solar-flow.git)
cd urjalink-solar-flow

Install Frontend Dependencies:
(From the project's root directory)

npm install

Install Backend Dependencies:

cd server
npm install

Running the Application
You will need to run the frontend and backend servers at the same time in two separate terminal windows.

Run the Backend Server:
(From inside the server directory)

node server.js

You should see the message "MongoDB connected..." in the terminal.

Run the Frontend Development Server:
(From the project's root directory)

npm run dev

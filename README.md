SMART HOSTEL ROOM ALLOCATION SYSTEM

A full-stack web application for intelligent hostel room management and automated room allocation.
Built with React + Vite on the frontend and Node.js + Express + PostgreSQL (Neon) on the backend.


LIVE DEMO
---------
Frontend (Full Working Application): https://hotel-1-gmka.onrender.com
Backend API (Render): https://hotel-b70l.onrender.com


FEATURES
--------
• Add, view, and delete hostel rooms
• Search rooms by capacity, AC, and attached washroom
• Smart room allocation based on student requirements
• Allocates the smallest suitable room to optimize space usage
• Real-time data fetched from backend APIs
• Responsive and clean UI using Tailwind CSS
• RESTful backend architecture
• Persistent storage using Neon PostgreSQL


TECHNOLOGIES USED
-----------------

Frontend:
• JavaScript (ES6+)
• React.js
• Vite
• Tailwind CSS
• Axios

Backend:
• Node.js
• Express.js
• PostgreSQL (Neon – cloud hosted)
• pg (node-postgres)
• dotenv

Deployment & Tools:
• Git & GitHub
• Render (Frontend)
• Render (Backend)
• Neon Console (Database)


PROJECT STRUCTURE
-----------------
hostel/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── roomController.js
│   ├── models/
│   │   └── Room.js
│   ├── routes/
│   │   └── roomRoutes.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddRoom.jsx
│   │   │   ├── RoomList.jsx
│   │   │   └── SearchAllocate.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md


ROOM ALLOCATION LOGIC
---------------------
• Filters rooms that satisfy student count and facility requirements
• Sorts eligible rooms by capacity in ascending order
• Allocates the smallest possible suitable room
• Displays “No room available” if no room matches the criteria


INSTALLATION & SETUP
--------------------

Prerequisites:
• Node.js (v14 or higher)
• npm or yarn
• Neon PostgreSQL account


1. Clone Repository
-------------------
git clone https://github.com/arpitjain99/Hotel.git
cd hostel


2. Database Setup (Neon PostgreSQL)
----------------------------------
• Create account at https://neon.tech
• Create a PostgreSQL project
• Copy DATABASE_URL
• Add it to backend/.env

Example .env file:
PORT=5000
DATABASE_URL=your_neon_database_url_here


3. Backend Setup
----------------
cd backend
npm install
npm run dev

Backend runs on:
http://localhost:5000


4. Frontend Setup
-----------------
cd Frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173


AVAILABLE SCRIPTS
-----------------

Backend:
• npm run dev     → Development mode
• npm start       → Production mode

Frontend:
• npm run dev
• npm run build


AUTHOR
------
Arpit Jain
GitHub: https://github.com/arpitjain99


ASSIGNMENT COMPLIANCE
---------------------
✓ Fully functional application
✓ Live deployment
✓ Smart allocation logic
✓ Clean UI and backend architecture
✓ Real database integration using Neon PostgreSQL

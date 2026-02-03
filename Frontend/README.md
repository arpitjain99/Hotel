# Smart Hostel Room Allocation System

## 📋 Project Description

A modern, fully responsive web application for managing hostel rooms and intelligently allocating them to students based on specific requirements. The system uses a smart algorithm to allocate the smallest suitable room, optimizing space utilization while meeting all facility requirements.

## 🌐 Live Demo

Coming soon on Vercel/Netlify!

## ✨ Features

### 1. **Add Room Management**
- Create new hostel rooms with detailed specifications
- Fields: Room Number, Capacity, AC Availability, Attached Washroom
- Real-time validation for duplicate room numbers and positive capacity
- Success notifications on room addition
- Data persists in localStorage

### 2. **View All Rooms**
- Display all rooms in a professional table format (desktop)
- Responsive card layout for mobile devices
- Shows room details: Number, Capacity, AC Status, Washroom Status
- Delete functionality for room management
- Real-time room count display

### 3. **Search & Smart Allocation**
- Advanced filtering by student count, AC requirement, and washroom requirement
- Smart allocation algorithm that:
  - Filters rooms by capacity and facilities
  - Sorts by capacity (ascending)
  - Allocates the smallest suitable room
- Displays allocation result with visual feedback
- Shows all matching rooms for reference
- Handles "no available room" scenarios gracefully

### 4. **Smart Room Allocation Logic**
The core algorithm:
```javascript
// Filter rooms that meet all criteria
validRooms = rooms.filter(room => 
  room.capacity >= studentCount &&
  (needsAC ? room.hasAC : true) &&
  (needsWashroom ? room.hasAttachedWashroom : true)
)

// Sort by capacity (ascending) to get the smallest room
validRooms.sort((a, b) => a.capacity - b.capacity)

// Allocate the first valid room
allocatedRoom = validRooms[0] || null
```

### 5. **Data Persistence**
- All rooms saved in MongoDB via the Node.js/Express backend
- Data survives page refreshes and browser sessions

## 🛠️ Tech Stack

- **Frontend Framework**: React.js 18.2.0
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.4.1
- **JavaScript**: ES6+
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Backend Runtime**: Node.js
- **Backend Framework**: Express.js
- **Database**: MongoDB Atlas (via Mongoose)
- **Environment Variables**: dotenv
- **CORS**: Enabled via `cors` middleware
- **Deployment**: Vercel/Netlify (frontend), Render (backend)

## 📁 Project Structure

```
assignment 1/
├── src/
│   ├── components/
│   │   ├── AddRoom.jsx          # Room creation form component
│   │   ├── RoomList.jsx         # Display all rooms component
│   │   └── SearchAllocate.jsx   # Search and allocation component
│   ├── App.jsx                  # Main application component
│   ├── api.js                   # Axios API client (frontend → backend)
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection helper (Mongoose)
│   ├── controllers/
│   │   └── roomController.js    # Room CRUD, search, and allocation logic
│   ├── models/
│   │   └── Room.js              # Mongoose Room schema/model
│   ├── routes/
│   │   └── roomRoutes.js        # Express routes for /api/rooms
│   ├── .env.example             # Sample environment variables
│   └── server.js                # Express server entrypoint
├── public/
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation (Full Stack)

1. Navigate to the project directory:
```bash
cd "assignment 1"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file for the backend (copy from sample):
```bash
cp backend/.env.example backend/.env
```

4. Edit `backend/.env` and set:
```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
```

5. Start the backend server:
```bash
npm run server:dev
```

6. In another terminal, start the frontend dev server:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

### Build for Production (Frontend)

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 💡 How to Use

### Adding a Room

1. Click the **"➕ Add Room"** tab
2. Fill in the room details:
   - **Room Number**: Unique identifier (e.g., 101, A-201)
   - **Capacity**: Number of students the room can accommodate
   - **AC**: Check if the room has air conditioning
   - **Attached Washroom**: Check if the room has its own washroom
3. Click **"➕ Add Room"** button
4. Success message confirms the room has been added

### Viewing Rooms

1. Click the **"👀 View Rooms"** tab
2. See all added rooms in a table (desktop) or cards (mobile)
3. Click **"Delete"** to remove a room

### Searching & Allocating Rooms

1. Click the **"🔍 Search & Allocate"** tab
2. Enter the requirements:
   - **Number of Students**: How many students need to be accommodated
   - **Requires AC**: Check if AC is mandatory
   - **Requires Attached Washroom**: Check if washroom is mandatory
3. Click **"🔍 Search Rooms"** button
4. The system displays:
   - **Smart Allocation Result**: The best room (smallest suitable room)
   - **All Matching Rooms**: List of all rooms that meet the criteria

## 🧠 Smart Allocation Algorithm Explanation

The allocation system uses an optimal algorithm:

1. **Filter Phase**: Find all rooms that satisfy the requirements
   - Capacity must be ≥ student count
   - AC requirement must be met (if checked)
   - Washroom requirement must be met (if checked)

2. **Sort Phase**: Sort filtered rooms by capacity in ascending order
   - This ensures we get the smallest suitable room

3. **Allocate Phase**: Return the first room from sorted list
   - If no rooms available, return null with appropriate message

**Why this approach?**
- **Space Optimization**: Allocates the smallest room that fits, leaving larger rooms for groups that need them
- **Efficiency**: O(n log n) time complexity due to sorting
- **Fair Allocation**: Ensures systematic, predictable room assignment

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Works seamlessly on mobile, tablet, and desktop
- **Color-Coded Status**: 
  - Blue for AC status
  - Green for Washroom status
  - Red for errors and delete actions
- **Visual Feedback**: 
  - Success notifications
  - Error messages in red
  - Allocated room highlighted in green
- **Intuitive Navigation**: Tab-based interface for easy section switching
- **Real-time Updates**: Instant feedback on all actions

## 🛡️ Error Handling

- **Duplicate Room Numbers**: Prevents adding rooms with existing room numbers
- **Invalid Inputs**: Validates all form fields before submission
- **Positive Capacity**: Ensures capacity is a positive number
- **Empty Searches**: Displays appropriate message when no rooms match criteria
- **No Available Rooms**: Clear notification when no suitable room exists

## 📦 Dependencies

### Production (Frontend)
- `react@^18.2.0` - React library
- `react-dom@^18.2.0` - React DOM rendering
- `axios@^1.7.9` - HTTP client

### Production (Backend)
- `express@^4.21.2` - Web framework
- `mongoose@^8.8.1` - MongoDB ODM
- `cors@^2.8.5` - CORS middleware
- `dotenv@^16.4.5` - Environment variable loader

### Development
- `@vitejs/plugin-react@^4.2.1` - React plugin for Vite
- `vite@^5.0.8` - Build tool
- `tailwindcss@^3.4.1` - CSS framework
- `postcss@^8.4.32` - CSS processor
- `autoprefixer@^10.4.16` - CSS vendor prefixing
- `nodemon@^3.1.7` - Auto-restart for backend during development

## 🚀 Deployment

### Backend Deployment (Render + MongoDB Atlas)

1. Push your project to GitHub.
2. Create a MongoDB Atlas cluster and get the connection string.
3. Go to [Render](https://render.com), click **"New + → Web Service"**.
4. Select your GitHub repository.
5. Set:
   - **Root directory**: the repository root
   - **Build command**: `npm install`
   - **Start command**: `npm start`
6. Add environment variables:
   - `PORT=10000` (or leave blank and use Render’s default)
   - `MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING`
7. Deploy and note the backend URL (e.g., `https://your-app.onrender.com`).
8. In the frontend, set `VITE_API_BASE_URL` to this URL.

### Frontend Deployment (Vercel or Netlify)

1. Push code to GitHub.
2. Set environment variable `VITE_API_BASE_URL` to your Render backend URL.

**Vercel**
1. Go to [Vercel](https://vercel.com).
2. Click **"New Project"**, select your repository.
3. Vercel auto-detects Vite settings.
4. Set `VITE_API_BASE_URL` in Project Settings → Environment Variables.
5. Deploy.

**Netlify**
1. Go to [Netlify](https://netlify.com).
2. Click **"New site from Git"**, connect your repository.
3. Set build command: `npm run build`.
4. Set publish directory: `dist`.
5. Add `VITE_API_BASE_URL` as an environment variable.
6. Deploy.

## 🔒 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Code Quality Standards

- ✅ No commented code
- ✅ Reusable, modular components
- ✅ Proper React hooks usage
- ✅ Meaningful variable and function names
- ✅ Clean, readable code formatting
- ✅ Error handling throughout
- ✅ Responsive design implementation
- ✅ localStorage persistence

## 🎯 Future Enhancements (Optional)

- Backend integration with database
- User authentication and authorization
- Room images/photos
- Booking history and analytics
- Email notifications
- Advanced filtering and sorting
- Room availability calendar
- Student feedback system

## 📄 License

Open source - feel free to use and modify

## 👨‍💻 Developer

Built with ❤️ as a production-ready application

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: ✅ Production Ready

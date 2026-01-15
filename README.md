# 🛡️ EduVault - Academic Resource Management Platform

**EduVault** is a premium, full-stack e-learning platform built using the **MERN** stack (MongoDB, Express, React, Node). It is designed to provide students with a centralized, verified "Vault" for academic resources, including lecture notes, previous year question papers (PYQs), video playlists, and essential learning links.

---

## ✨ Key Features

### 👨‍🎓 Student Experience
- **Hierarchical Discovery**: Navigate effortlessly from University ➡️ Course ➡️ Subject ➡️ Semester.
- **Advanced Filtering**: Real-time search and filter capabilities for years, semesters, and resource types.
- **Hierarchical Back-Navigation**: A smart navigation system that returns to the previous logical step (e.g., from Subject view to Course view).
- **Premium UI**: Modern, glassmorphic design featuring smooth animations powered by **Framer Motion**.

### 🔐 Admin Control Center
- **Resource Management**: Complete CRUD functionality for Universities and Study Materials.
- **Smart Forms**: Integrated course suggestions and dynamic semester tagging (Support for Semesters 1-8).
- **Secure Authentication**: Protected routes and session management using JWT.
- **Real-time Feedback**: Professional toast notifications for all operations using `react-hot-toast`.

---

## 🛠️ Tech Stack

- **Frontend**: 
  - React.js (Vite)
  - Tailwind CSS (Premium Styling)
  - Framer Motion (Animations)
  - Lucide React (Iconography)
  - Axios (API Communication)
- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose (Schema Design)
  - JSON Web Token (JWT) Authentication
  - Dotenv (Environment Management)

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-learning-content-app
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_password
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=https://e-learning-content-platform.onrender.com
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend Client**
   ```bash
   cd client
   npm run dev
   ```

The application should now be running on `http://localhost:5173`.

---

## 🧭 Project Structure

```text
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # High-level screens (Home, Materials, Admin)
│   │   ├── components/    # Reusable UI elements
│   │   └── App.jsx        # Root routing logic
├── server/                 # Express backend
│   ├── controllers/       # Business logic for API endpoints
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   └── index.js           # Server entry point
```

---

## 🛡️ License
Distributed under the MIT License.

## ✍️ Author
Shahana 

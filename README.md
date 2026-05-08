<div align="center">
  
# 🎓 Studify

**Your AI-Powered Academic Co-Pilot**

[![Frontend Deployment](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)](https://studify-iota.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.x-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Pro-orange?logo=google)](https://deepmind.google/technologies/gemini/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql)](https://supabase.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)

[Live Demo](https://studify-iota.vercel.app/) • [Report Bug](#-contributing) • [Request Feature](#-contributing)

</div>

---

## 📌 Overview

**Studify** is a comprehensive, AI-driven educational platform designed to transform raw study materials into intelligent, actionable, and personalized learning paths. By deeply analyzing presentation decks (PPTX) and PDF documents, Studify extracts core concepts, accurately estimates required study times, and dynamically generates custom schedules and interactive quizzes.

Say goodbye to manual planning and hello to optimized, interactive learning.

---

## ✨ Core Features

| Feature | Description |
| :--- | :--- |
| **📊 Intelligent Dashboard** | A centralized hub providing real-time analytics on your study progress, subject coverage, and recently uploaded materials. |
| **🧬 AI Material Analysis** | Upload `.pptx` or `.pdf` files and let **Google Gemini AI** automatically extract key topics, estimate study duration, and formulate personalized preparation tips. |
| **📅 Dynamic Study Planner** | Generates highly customized study schedules that adapt to your personal learning speed, available daily study hours, and upcoming exam deadlines. |
| **🗓️ Interactive Calendar** | Visualize your study sessions in intuitive monthly and weekly views. Seamlessly export your schedule to `.ics` format for Google/Apple Calendar integration. |
| **🧠 AI Quiz Generation** | Automatically synthesizes active-recall quizzes directly from your uploaded materials to rigorously test your knowledge retention. |
| **📚 Subject Management** | Effortlessly organize materials by subject. Customize subject tags with distinct colors and descriptions for visual clarity. |
| **👥 Peer Review System** | *(Beta)* A collaborative inbox for material requests and peer-reviewed study resources. |

---

## 🛠️ Technology Stack

Studify leverages a modern, robust, and scalable full-stack architecture.

### 💻 Frontend
- **Core:** [React 18](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

### ⚙️ Backend
- **Core:** [FastAPI](https://fastapi.tiangolo.com/)
- **Databases:** Hybrid architecture using **PostgreSQL** (via [Supabase](https://supabase.com/)) for relational data and **MongoDB** for flexible quiz results storage.
- **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/)
- **AI Engine:** [Google Gemini Pro API](https://ai.google.dev/)
- **File Parsing:** `python-pptx`, `pymupdf`

---

## 🚀 Getting Started

Follow these instructions to set up Studify on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/rockerperfect/Studify.git
cd Studify
```

**2. Setup the Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

**3. Configure Environment Variables**
Create a `.env` file in the `backend` directory with the following keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_postgresql_url
MONGODB_URI=your_mongodb_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
VITE_API_URL=http://127.0.0.1:8000
```

**4. Start the Backend Server**
```bash
uvicorn main:app --reload
```

**5. Setup and Start the Frontend**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API documentation at `http://localhost:8000/docs`.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ for students everywhere.</p>
</div>

# 🎓 Studify

**Frontend Deployment:** [https://studify-iota.vercel.app/](https://studify-iota.vercel.app/)  

**Studify** is an AI-powered educational platform that helps students convert study materials into intelligent, personalized learning paths. By analyzing presentation decks and documents, the platform generates insights, study plans, and quizzes to make learning more organized, efficient, and interactive.

---

## 📌 Overview

Studify is designed to simplify academic preparation by combining material analysis, scheduling, and self-assessment into one platform. Students can upload their academic content, receive AI-driven topic extraction and study recommendations, and generate structured plans based on available time and exam deadlines.

The platform reduces manual effort in planning and improves learning efficiency through automation and intelligent assistance.

---

## ✨ Features

### 📊 Intelligent Dashboard
- Provides a real-time overview of study progress
- Displays subject coverage and recently uploaded materials
- Helps students monitor their academic workflow in one place

### 🧬 AI Material Analysis
- Supports uploading `.pptx` files for automated analysis
- Uses **Gemini AI** to extract key topics and concepts
- Estimates required study time
- Generates personalized study tips for better preparation

### 📅 Dynamic Study Planner
- Creates customized study schedules
- Considers available study hours, learning speed, and exam dates
- Helps students build realistic and efficient learning plans

### 🗓️ Interactive Calendar
- Displays study sessions in monthly and weekly calendar views
- Improves time management and schedule visualization
- Allows export to `.ics` format for use in external calendar applications

### 🧠 AI Quiz Generation
- Automatically generates quizzes from uploaded study materials
- Enables self-assessment and revision
- Supports active recall for better retention

### 📚 Subject Management
- Organizes materials subject-wise
- Allows custom subject colors and descriptions
- Makes academic content easier to manage and access

### ✅ Completion Tracking *(Coming Soon)*
- Will allow students to mark materials as completed
- Will help track mastery and learning progress over time

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend
- **Framework:** FastAPI
- **Database:** SQLite + SQLAlchemy
- **AI Integration:** Google Gemini Pro
- **File Parsing:** python-pptx

---

## 🚀 Getting Started

### Prerequisites
Before running the project, make sure you have:

- **Node.js** v18 or above
- **Python** v3.10 or above
- A valid **Gemini API Key**

---

## ⚙️ Installation and Setup

### 1. Install Dependencies
Run the following command from the root directory:

```bash
npm run install:all

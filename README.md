# 🧶 KnitLens  
## AI-Powered Crochet Progress Tracker and Smart Crafting Assistant


## 📌 Overview

KnitLens is an AI-powered Crochet Progress Tracker and Smart Crafting Assistant that combines Computer Vision and Multimodal Artificial Intelligence to help crochet enthusiasts analyze their projects, detect visible mistakes, track progress, and receive personalized guidance.

Traditional crochet applications mainly provide written patterns and tutorial videos, but they cannot understand the user's actual crochet work. KnitLens solves this problem by allowing users to upload images of their crochet projects and receive AI-powered analysis and recommendations.

The system uses a YOLOv11 Computer Vision model to analyze crochet images and Alibaba Cloud Qwen Multimodal AI to generate intelligent, user-friendly crochet guidance.

---

# 🎯 Problem Statement

Crochet enthusiasts, especially beginners, often struggle with:

- Identifying mistakes in their crochet work
- Tracking project progress
- Understanding complex patterns
- Knowing the correct next steps

Small mistakes such as missing stitches or holes may remain unnoticed until much later, causing users to undo hours of work.

Existing crochet applications rely on manual tracking and static instructions. They do not analyze the user's real project or provide personalized assistance.

KnitLens introduces an intelligent AI assistant that understands crochet projects through image analysis.

---

# 💡 Proposed Solution

KnitLens provides an interactive platform where users can:

- Create and manage crochet projects
- Upload images of their crochet work
- Analyze crochet images using AI
- Detect visible defects
- Receive personalized crochet guidance
- Track project history and progress

The goal is to transform traditional crochet learning into a smarter and more interactive experience.

---

# ✨ Features

## 🔐 User Authentication

- User Registration
- Secure Login
- User Profile Management

---

## 🧶 Crochet Project Management

Users can create and manage multiple crochet projects.

Each project contains:

- Project name
- Project type
- Difficulty level
- Yarn color
- Hook size
- Pattern description
- Project notes
- Progress information

Users can:

- Create new projects
- View projects
- Update projects
- Delete projects
- Continue previous projects

---

## 📷 AI Crochet Image Scanner

Users upload an image of their crochet work.

The image passes through an AI analysis pipeline:

```
User Uploads Image
        |
        ↓
YOLOv11 Computer Vision Model
        |
        ↓
Object Detection Results
        |
        ↓
Alibaba Cloud Qwen AI
        |
        ↓
Personalized Crochet Guidance
```

---

## 🤖 Computer Vision Analysis

KnitLens uses YOLOv11 for image analysis.

The model detects:

- Crochet swatch
- Visible holes/defects

The system provides:

- Detected objects
- Confidence scores
- AI interpretation

---

## 🧠 AI Smart Guidance

Alibaba Cloud Qwen processes the detection results and provides:

- Explanation of detected issues
- Suggested corrections
- Next crochet steps
- Beginner-friendly guidance

---

## 📊 Progress Tracking

Users can monitor:

- Project progress
- Previous scans
- Analysis history
- Project improvements

---

# 🏗 System Architecture

```
                 User
                  |
                  |
          React Web Application
                  |
                  |
            FastAPI Backend
                  |
        -------------------------
        |                       |
     YOLOv11              Alibaba Qwen
   Computer Vision       Multimodal AI
        |                       |
        -------------------------
                  |
                  |
             MongoDB Atlas
```

---

# 🛠 Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Framer Motion

## Backend

- Python
- FastAPI

## Database

- MongoDB Atlas

## Artificial Intelligence

- YOLOv11
- Alibaba Cloud Qwen Multimodal AI

## Cloud Platform

- Alibaba Cloud AI Services

---

# 📂 Project Structure

```
KnitLens/

│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── uploads/
│   └── requirements.txt
│
├── .env.example
├── .gitignore
├── README.md
└── package files
```

---

# 🚀 Installation Guide

## Clone Repository

```bash
git clone https://github.com/yourusername/KnitLens.git

cd KnitLens
```

---

# Frontend Setup

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create environment file:

```
.env
```

Example:

```
VITE_API_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

---

# Backend Setup

Go to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Install requirements:

```bash
pip install -r requirements.txt
```

Create environment file:

```
.env
```

Example:

```
MONGODB_URI=your_database_connection
QWEN_API_KEY=your_api_key
SECRET_KEY=your_secret_key
```

Run backend:

```bash
uvicorn main:app --reload
```

---

# 🗂 Dataset

KnitLens uses a custom crochet image dataset.

The dataset includes:

- Crochet swatch images
- Different yarn colors
- Different backgrounds
- Different lighting conditions
- Crochet defects

Images were manually annotated using Roboflow for YOLO training.

---

# 🧠 AI Models

## YOLOv11

Used for:

- Crochet image detection
- Swatch recognition
- Defect detection


## Alibaba Cloud Qwen

Used for:

- Understanding detection results
- Generating crochet recommendations
- Providing natural language guidance

---

# 🔮 Future Enhancements

Future versions of KnitLens will include:

- Real-time camera scanning
- Stitch-level recognition
- AI-generated crochet patterns
- Voice-based crochet assistant
- Mobile application
- Knitting and embroidery support
- Community pattern sharing
- Multilingual support

---

# 👥 Project Information

## Project Name

KnitLens

## Category

AI + Computer Vision + Smart Assistant

## Built For

Alibaba Cloud AI Hackathon Pakistan 2026

---

# 📜 License

This project is developed for educational and hackathon purposes.

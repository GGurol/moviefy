# 🎬 MovieFy

A full-stack movie platform with user and admin interfaces — featuring movie streaming, reviews, and content management — built with **React**, **Node.js**, and **MongoDB**.

## 🚀 Project Overview

**MovieFy** is a feature-rich movie application with two distinct portals: one for regular users and one for administrators.

- Users can stream movies, view cast and genre information, write reviews with star ratings, and toggle between light/dark modes and multiple languages.
- Admins can manage the movie database, including adding/editing movie entries and actor profiles.

## 💡 Motivation

The project was born out of a desire to create a real-world movie streaming and review platform — a place to apply and deepen my skills in **full-stack development**, **UX design**, and **internationalization**.

## 👨‍💻 My Role

As a solo developer, I was responsible for every aspect of the app, including:

- UI/UX design for both user and admin dashboards
- Full-stack development (frontend, backend, and API integration)
- Secure user authentication and role-based access control
- Docker-based containerization for consistent development and deployment
- Caddy configuration as a static file server and reverse proxy

## 🛠️ Tech Stack

| Layer        | Tools & Libraries                 |
| ------------ | --------------------------------- |
| **Frontend** | React, Tailwind CSS, shadcn/ui    |
| **Backend**  | Node.js, Express                  |
| **Database** | MongoDB                           |
| **Auth**     | JSON Web Tokens (JWT), Nodemailer |
| **i18n**     | react-i18next                     |
| **DevOps**   | Docker, Caddy                     |

## 📦 Development Process

1. **UI/UX Design** – Mocked responsive layouts for user and admin flows
2. **Frontend** – Built modular, styled interfaces with React and Tailwind
3. **Backend** – Created RESTful APIs to handle movies, actors, reviews
4. **Localization** – Integrated i18n with support for English and Chinese
5. **Deployment** – Dockerized the app and deployed using Caddy for reverse proxying and static serving

## 🌟 Key Features

### 🧑‍💻 User Side

- 🎞️ Stream movies and search by title
- 🧑‍🤝‍🧑 View detailed cast, genres, and related movies
- ⭐ Submit and read star-based reviews
- 🌙 Toggle dark/light themes
- 🌐 Switch between English and Chinese

### 🔧 Admin Side

- 🎬 Add/edit/delete movies with cover images and videos
- 🎭 Manage actor profiles with names and pictures
- 📝 Monitor user-submitted reviews and ratings

## 🧩 Challenges & Solutions

### 1. Advanced Admin Movie Form

**Challenge:** Creating a highly functional form with live actor search, multilingual support, file uploads, and validation.

**Solution:**

- UI: Used `shadcn/ui` for polished form components
- Validation: Combined `react-hook-form` with `Zod` for schema-based validation
- Language Switching: Seamlessly integrated `react-i18next`
- Actor Search: Implemented debounced live search
- File Uploads: Built custom file input controls for video/image submission

### 2. Custom Authentication & Authorization

**Challenge:** Secure user login system with role-based access and account verification.

**Solution:**

- Email Verification: Used `Nodemailer` to send activation emails with secure tokens
- JWT Authentication: Managed user sessions and protected admin routes
- Role Restrictions: Limited review and rating features to verified users
- Password Reset: Built a tokenized reset flow with email delivery

📱 Social Media App

A full-stack social media platform where users can sign up, post updates, like, comment, follow friends, and chat in real-time.

🚀 Features

🔐 Authentication & Authorization using JWT

📧 Email Verification via Nodemailer / SendGrid

👤 User Profiles with profile picture & bio

📝 Post System (create, edit, delete posts)

❤️ Likes & Comments on posts

📸 Image Uploads using Multer + Cloudinary

💬 Real-time Chat & Notifications with Socket.io

🔔 Email + In-app Notifications

🌎 CORS-enabled APIs

🛠️ Tech Stack
Frontend

React / HTML / CSS / JavaScript (your choice)

Backend

Node.js + Express.js

MongoDB + Mongoose

JWT for authentication

Multer + Cloudinary for file uploads

Nodemailer / SendGrid for email

Socket.io for real-time communication






📦 Backend Routes

- Auth Routes → /api/auth

- POST /register → Register user

- POST /login → Login user

- GET /verify/:token → Verify email

- User Routes → /api/users

- GET /:id → Get user profile

- PUT /update → Update profile

- POST /follow/:id → Follow user

- POST /unfollow/:id → Unfollow user

- Post Routes → /api/posts

- POST / → Create post

- GET / → Get all posts

- PUT /:id → Update post

- DELETE /:id → Delete post

- POST /:id/like → Like post

- POST /:id/comment → Comment on post

- Upload Routes → /api/upload

- POST / → Upload image

- Chat Routes → /api/chats

- GET /:chatId → Get messages

- POST /:chatId → Send message
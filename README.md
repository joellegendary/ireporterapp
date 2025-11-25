# 📌 iReporterApp — Crime Reporting & Intervention System

iReporterApp is a full-stack web application that enables citizens to report corruption, crimes, and incidents requiring urgent government attention. Reports are submitted as **Red Flags** or **Intervention Requests**, and the system provides separate dashboards for both **Users** and **Admins**. Admin users are assigned manually from the backend database.

---

## 🚀 Features

### 👤 User Features

- Submit Red Flag and Intervention reports
- Add media attachments (images/videos)
- Select location using an interactive **Leaflet Map Picker**
- Edit reports while still pending
- Delete personal reports
- View history of all reports
- User authentication (signup/login)

### 🛡️ Admin Features

- Admin role selected from backend database
- Admin dashboard for all reports
- Update report status (Pending → Investigating → Resolved → Rejected)
- Delete inappropriate or invalid reports

---

## 🏗 Tech Stack

### Frontend

- React (TypeScript)
- React Router
- Context API
- Axios
- Leaflet (Map Picker)
- React Hot Toast (optional)

### Backend

- Node.js (Express)
- MySQL (mysql2/promise)
- JWT Authentication
- Bcrypt password hashing

---

## 📍 Leaflet Map Picker

The application includes a dynamic map allowing users to select accurate locations for their reports. Users can:

- Click anywhere on the map to set coordinates
- Use a **“Use My Location”** button
- Drag the marker to adjust position

Leaflet installation is required for this feature.

---

## 📦 Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/ireporterapp.git
cd ireporterapp
```

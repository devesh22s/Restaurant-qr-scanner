<div align="center">
  <img src="https://img.shields.io/badge/Restaurant%20QR%20Scanner-Application-black?style=for-the-badge&logo=opencv&logoColor=white" />
  
  <h1>🍽️ Restaurant QR Scanner</h1>
  <p><strong>A modern QR-powered digital menu system built with MERN stack</strong></p>

  <img src="https://img.shields.io/github/license/devesh22s/Restaurant-qr-scanner?style=flat-square" />
  <img src="https://img.shields.io/github/deployments/devesh22s/Restaurant-qr-scanner/production?label=vercel%20deploy&logo=vercel&style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/devesh22s/Restaurant-qr-scanner?style=flat-square" />
  
  <br/>
  <a href="https://restaurant-qr-scanner.vercel.app/">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-Click%20Here-blue?style=for-the-badge" />
  </a>
</div>

---


## ⭐ Introduction  
Restaurant QR Scanner is a **full-stack QR-based menu system** that allows customers to scan a table QR code and instantly view the restaurant’s digital menu — without any app download.

Built using the **MERN stack**, deployed on **Vercel**, optimized for speed and modern UI/UX.

---

## 🚀 Features  
### 🧭 Core Features  
- 📱 **QR Code → Instant Menu View**  
- 🍔 **Food Items with Image, Price, and Description**  
- ⚡ **Fast, Responsive & Mobile Friendly UI**  
- 🔒 **Secure Backend with Express + JWT**  
- 🚀 **Fully Cloud Deployed (Vercel)**  

### 🛠️ Admin & Backend  
- ➕ Add/Update/Delete Menu Items  
- 📊 Track menu items  
- 💾 MongoDB-based persistent storage  

---

## 🏗️ Architecture  
```
Frontend (React)
       ↓
Backend (Node + Express)
       ↓
Database (MongoDB)
       ↓
Hosting (Vercel)
```

---

## 📂 Folder Structure  
```bash
Restaurant-qr-scanner
│
├── client/          # React frontend
│   ├── src/
│   └── public/
│
├── server/          # Node + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## 🧪 Tech Stack  

### 🎨 Frontend  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### 🛠 Backend  
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### 🚀 Deployment  
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🖥️ Installation  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/devesh22s/Restaurant-qr-scanner.git
cd Restaurant-qr-scanner
```

---

## 2️⃣ Setup Client  
```bash
cd client
npm install
npm run dev
```

---

## 3️⃣ Setup Server  
```bash
cd server
npm install
npm start
```

---

## 🔑 Environment Variables  
Create a `.env` file inside `/server`

```
PORT=3000
MONGO_URI=your_mongo_database_url
JWT_SECRET=your_secret_key
```

---

## 🔗 API Endpoints  

### **Menu Routes**
| Method | Route | Description |
|--------|--------|-------------|
| GET | /api/menu | Get all menu items |
| POST | /api/menu | Add menu item |
| PUT | /api/menu/:id | Update item |
| DELETE | /api/menu/:id | Delete item |

---

## 📸 Screenshots  
> Add screenshots after deployment  
(I can design premium screenshots too.)

---

## 🎥 Demo GIF  
> Add a GIF showing the QR flow  
(If you want, I will generate a smooth animation.)

---

## 🗺️ Roadmap  
- [ ] Admin dashboard  
- [ ] Order management  
- [ ] Table-wise analytics  
- [ ] Multi-restaurant support  
- [ ] Payment integration  

---

## 🤝 Contributing  
Pull requests are welcome!  
For major changes, please open an issue first.

---

## 🧑‍💻 Author  
**Devesh Kumar**  
Full Stack Developer  
GitHub: https://github.com/devesh22s  

---

## 📜 License  
This project is licensed under the **MIT License**.


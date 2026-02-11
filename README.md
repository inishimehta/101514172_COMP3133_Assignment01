# Employee Management System (Backend) — COMP3133 Assignment 1 

Backend Employee Management System built with **Node.js**, **Express**, **Apollo GraphQL**, and **MongoDB**.

Includes:
- 🔐 JWT Authentication
- 🧑‍💼 Employee CRUD Operations
- 🔎 Employee Search
- ✅ Input Validation
- ☁️ Cloudinary Photo Storage

---

## 🚀 Tech Stack

- Node.js + Express
- Apollo Server (GraphQL)
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary
- express-validator
- Postman (API Testing)

---

## 📌 GraphQL APIs

### 👤 User

**Mutation**
- `signup(username, email, password)`

**Query**
- `login(usernameOrEmail, password)`

---

### 🧑‍💼 Employee

**Queries**
- `getAllEmployees`
- `searchEmployeeByEid(eid)`
- `searchEmployeeByDesignationOrDepartment(designation, department)`

**Mutations**
- `addNewEmployee(input)`
- `updateEmployeeByEid(eid, input)`
- `deleteEmployeeByEid(eid)`

---

## 🗄️ Database

**MongoDB Database Name**
```
comp3133__101514172_assigment1
```

**Collections**
- `users`
- `employees`

---

## 🔐 Environment Variables

Create a `.env` file in the root folder:

```env
PORT=4000
MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=1d

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

---

## ▶️ Run the Project

```bash
npm install
npm run dev
```

### 🌐 URLs

- GraphQL Endpoint: http://localhost:4000/graphql
- Test Route: http://localhost:4000/test

---

## 🧪 Postman Testing

- All GraphQL operations tested in Postman
- Postman Collection exported (v2.1)
- Screenshots captured for:
  - Each request/response
  - MongoDB Atlas collections and documents

---

## 📸 Cloudinary Upload

- `employee_photo` is uploaded to Cloudinary
- Stored in MongoDB as a URL

For Postman testing, photo can be provided as:
- A public image URL (recommended)
- A Base64 Data URI

---

## 📦 Submission Checklist

- Screenshots in a single DOCX
- MongoDB Atlas screenshots (collections + documents)
- Postman collection export
- Project ZIP (without node_modules)
- GitHub repository link
- Sample user credentials for login testing

---

## 👩‍💻 Student Info

- Student ID: 101514172
- Repository: https://github.com/inishimehta/101514172_COMP3133_Assignment01

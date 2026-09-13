# Mini B2B RFQ Marketplace
 
A full-stack B2B Request for Quotation (RFQ) marketplace where buyers can create RFQs and suppliers can browse RFQs and submit quotations.
 
## 🚀 Live Application
 
**Frontend:**
https://rfq-marketplace-frontend-6hs2.onrender.com
 
**Backend API:**
https://rfq-marketplace-74vc.onrender.com
 
## ✨ Features
 
### Buyer
 
- Sign up and log in securely
- Create RFQs
- Edit RFQs
- Delete RFQs
- View submitted RFQs
- View quotations received from suppliers
- RFQ fields:
  - Product/service name
  - Requirement description
  - Quantity
  - Delivery location
  - Deadline
### Supplier
 
- Sign up and log in securely
- Browse available RFQs
- Search RFQs
- Filter RFQs by delivery location
- View complete RFQ details
- Submit quotations
- Edit previously submitted quotations
- View previously submitted quotations
### Quotation
 
Suppliers can submit:
 
- Quoted price
- Estimated delivery time
- Message / notes
## 🛠️ Technology Stack
 
### Frontend
 
- React
- Vite
- React Router
- Axios
- CSS
### Backend
 
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
### Deployment
 
- Render
- MongoDB Atlas
- GitHub
## 🏗️ Architecture
 
```text
                    User
                     │
                     ▼
             React + Vite
             Render Static Site
                     │
                     │ HTTPS API
                     ▼
              Express.js API
              Render Web Service
                     │
                     ▼
                  Mongoose
                     │
                     ▼
               MongoDB Atlas
```
 
## 💻 Setup Instructions
 
### Prerequisites
 
- Node.js
- npm
- MongoDB Atlas account
- Git
### 1. Clone the repository
 
```bash
git clone https://github.com/krishna-8bit/rfq-marketplace.git
cd rfq-marketplace
```
 
### 2. Setup Backend
 
```bash
cd backend
npm install
```
 
Create a `.env` file inside `backend`:
 
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
 
Start the backend:
 
```bash
npm run dev
```
 
Backend:
 
```text
http://localhost:5000
```
 
### 3. Setup Frontend
 
Open another terminal:
 
```bash
cd frontend
npm install
```
 
Create a `.env` file inside `frontend`:
 
```env
VITE_API_URL=http://localhost:5000/api
```
 
Start the frontend:
 
```bash
npm run dev
```
 
Frontend:
 
```text
http://localhost:5173
```
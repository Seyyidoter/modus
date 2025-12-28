# Modus ERP 🚀

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Modus ERP** is a modern, full-stack Inventory and Order Management System designed solely for flexibility and speed. It facilitates seamless workflows from internal demands to customer offers, managing stock with precision.

## 📸 Dashboard Preview

<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/8ed962d4-9cce-4270-b813-78f4a315ab3f" />


## ✨ Key Features

- **🔐 Role-Based Access Control (RBAC):** Secure authentication with JWT. Admin and User roles with specific permissions (e.g., only Admin can create products).
- **📦 Advanced Stock Management:** 
  - Multi-warehouse support.
  - Track Stock IN/OUT and Transfers between warehouses.
  - Detailed product history logs.
- **🔄 Demand-to-Offer Workflow:**
  - Create internal demands for products.
  - One-click conversion from **Demand** to **Customer Offer**.
  - Intelligent form pre-filling.
- **🌍 Internationalization (i18n):**
  - Instant language switching between **English** and **Turkish**.
- **💱 Multi-Currency Support:**
  - Create offers in **USD**, **EUR**, or **TRY**.
- **📊 Interactive Dashboard:**
  - Real-time statistics, low stock alerts, and recent activity feeds.
  - Visual trend indicators.

## 🛠️ Technology Stack

### Backend
- **Language:** Java 21 LTS
- **Framework:** Spring Boot 3.2
- **Database:** PostgreSQL 16
- **Security:** Spring Security & JWT
- **Migration:** Flyway
- **Build Tool:** Gradle

### Frontend
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **State Management:** TanStack Query (React Query)
- **UI Library:** Ant Design (Antd)
- **Routing:** React Router v6

### DevOps
- **Containerization:** Docker & Docker Compose
- **Network:** Nginx Reverse Proxy (Frontend serving)

## 🚀 Quick Start

Get the application running in less than 5 minutes!

### Prerequisites
- Docker Desktop installed and running.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Seyyidoter/modus.git
   cd modus-erp
   ```

2. **Start the Application**
   Run the production docker-compose file:
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

3. **Access the App**
   - **Frontend:** [http://localhost](http://localhost)
   - **API Docs:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (if enabled)

### Default Credentials
The system automatically seeds an Admin user on first run:
- **Email:** `admin@modus.app`
- **Password:** `admin123`

*(Note: Change these immediately after first login)*

## 📂 Project Structure

```
modus/
├── backend/            # Spring Boot Application
│   ├── src/
│   ├── Dockerfile
│   └── build.gradle
├── frontend/           # React Application
│   ├── src/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.prod.yml
```

## 🛡️ Security

- **JWT Authentication:** Stateless and secure.
- **BCrypt:** Password hashing.
- **Environment Variables:** Credentials are externalized.

## 📄 License

This project is licensed under the MIT License.

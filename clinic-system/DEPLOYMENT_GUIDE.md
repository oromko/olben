# Family Medium Clinic System - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Manual Installation](#manual-installation)
4. [Docker Deployment](#docker-deployment)
5. [Configuration](#configuration)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- Docker and Docker Compose (optional, for containerized deployment)

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
cd clinic-system
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Start all services:
```bash
docker-compose up -d
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MySQL: localhost:3306

### Manual Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Initialize the database:
```bash
mysql -u root -p < database/init.sql
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Start the backend:
```bash
cd backend
npm start
```

6. Start the frontend (in a new terminal):
```bash
cd frontend
npm start
```

## Manual Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file based on `.env.example`:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=family_clinic
PORT=5000
JWT_SECRET=your-secret-key
```

4. Run database migrations:
```bash
mysql -u root -p < ../database/init.sql
```

5. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

## Docker Deployment

### Build Custom Images

```bash
docker-compose build
```

### Start Services

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

## Configuration

### Environment Variables

#### Backend (.env)
- `DB_HOST`: Database host (default: localhost)
- `DB_USER`: Database user (default: root)
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name (default: family_clinic)
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)

#### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/patient/:patientId` - Get patient's appointments
- `GET /api/appointments/doctor/:doctorId` - Get doctor's appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create patient profile
- `PUT /api/patients/:id` - Update patient profile
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor profile
- `PUT /api/doctors/:id` - Update doctor profile
- `DELETE /api/doctors/:id` - Delete doctor

## Troubleshooting

### Database Connection Issues

1. Verify MySQL is running:
```bash
mysqladmin -u root -p ping
```

2. Check database credentials in `.env`

3. Ensure database exists:
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Backend Issues

1. Check if port 5000 is available:
```bash
lsof -i :5000
```

2. Verify all dependencies are installed:
```bash
cd backend && npm install
```

3. Check backend logs:
```bash
docker-compose logs backend
```

### Frontend Issues

1. Clear browser cache

2. Verify backend is running

3. Check console for errors

4. Rebuild frontend:
```bash
cd frontend && npm run build
```

### Docker Issues

1. Remove containers and volumes:
```bash
docker-compose down -v
```

2. Rebuild images:
```bash
docker-compose build --no-cache
```

3. Start fresh:
```bash
docker-compose up -d
```

## Support

For issues and questions, please check the documentation or contact support.

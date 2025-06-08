# TaskFlow

## Full-Stack Web Application Development & Deployment Project - TCSS 506

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com)
[![AWS](https://img.shields.io/badge/AWS-EC2-orange?logo=amazon-aws)](https://aws.amazon.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-TypeScript-blue?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org)

## 🎯 Project Overview

This repository contains our final capstone group project for TCSS 506 Practical Full Stack Development. We've designed and implemented a fully-functional web application with user authentication, database integration, and external API connectivity, deployed using Docker containers on AWS EC2.

TaskFlow is a comprehensive project management platform designed specifically for student teams to coordinate group projects, track assignments, and enhance collaboration. The application emphasizes collaborative planning, design, and deployment while applying modern design methodologies to improve modularity.

## 👥 Team Members

- **Preston Harms** - AWS Project Manager & DevOps
- **Richard Le** - Git/GitHub Version Control & Backend Development  
- **Jannine G. D. MacGormain** - Documentation & Project Coordination

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React TS)    │────│   (Node.js)     │
│   Port 80       │    │   Port 5000     │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                    │
    ┌─────────────────────────────────┐
    │         External APIs           │
    │  ┌─────────────┐ ┌─────────────┐│
    │  │  MongoDB    │ │   GitHub    ││
    │  │  (Atlas)    │ │    API      ││
    │  └─────────────┘ └─────────────┘│
    └─────────────────────────────────┘
```

## ✨ Features

- **🔐 User Authentication System**: Complete login/registration with Google OAuth integration
- **📋 Project Management**: Create, edit, and manage projects with team members
- **✅ Task Management**: Create, assign, and track tasks with Kanban-style boards
- **📅 Due Date Management**: Visual indicators for overdue and upcoming tasks
- **👥 Team Collaboration**: Role-based member management (Owner, Member, Viewer)
- **🔗 GitHub Integration**: Connect repositories and sync development progress
- **📱 Responsive UI**: Mobile-friendly design with intuitive user interface
- **🗄️ Database Integration**: MongoDB Atlas for scalable data storage
- **🐳 Docker Containerization**: Consistent deployment across environments
- **☁️ AWS Deployment**: Production-ready deployment on EC2

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **SCSS** for styling
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **Mongoose** for MongoDB interaction
- **JWT** for authentication
- **bcryptjs** for password hashing

### Database & Services
- **MongoDB Atlas** for data storage
- **Google OAuth 2.0** for authentication
- **GitHub API** for repository integration

### DevOps & Deployment
- **Docker** & Docker Compose
- **AWS EC2** for hosting
- **Nginx** for reverse proxy
- **Git/GitHub** for version control

## 📁 Project Structure

```
TaskFlow/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context (auth, etc.)
│   │   └── utils/         # Utility functions
│   ├── public/            # Static files
│   ├── package.json
│   └── Dockerfile
├── server/                 # Node.js Express backend
│   ├── controllers/       # Request handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # External service integrations
│   ├── config/           # Configuration files
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **npm** v8+
- **Docker** & Docker Compose
- **MongoDB Atlas** account
- **Google Developer** account
- **GitHub** account
- **AWS Account** (for deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chongwongus/TaskFlow-student-project-management.git
   cd TaskFlow-student-project-management
   ```

2. **Backend setup**
   ```bash
   cd server
   npm install
   
   # Create environment file
   cp .env.example .env
   ```

3. **Configure backend environment variables**
   ```bash
   # server/.env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskflow
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   GOOGLE_CLIENT_ID=your_google_client_id
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   CLIENT_URL=http://localhost:3000
   ```

4. **Frontend setup**
   ```bash
   cd ../client
   npm install
   
   # Create environment file
   cp .env.example .env
   ```

5. **Configure frontend environment variables**
   ```bash
   # client/.env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

6. **Start development servers**
   ```bash
   # Backend (in server directory)
   npm run dev
   
   # Frontend (in client directory)
   npm start
   ```

7. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## 🔑 External Service Configuration

### MongoDB Atlas Setup

1. Create a [MongoDB Atlas](https://cloud.mongodb.com) account
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Get the connection string and replace `<username>` and `<password>`
5. Whitelist your IP address in Network Access

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized origins**: `http://localhost:3000`, `http://YOUR_DOMAIN`
   - **Authorized redirect URIs**: `http://localhost:3000/auth/google/callback`
5. Copy the Client ID to your environment variables

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in application details:
   - **Application name**: TaskFlow
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/github/callback`
4. Copy Client ID and Client Secret to your environment variables

## 🐳 Docker Deployment

### Building Docker Images

1. **Create Dockerfiles**

   **Client Dockerfile** (`client/Dockerfile`):
   ```dockerfile
   # Build stage
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

   **Server Dockerfile** (`server/Dockerfile`):
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Docker Compose Configuration** (`docker-compose.yml`):
   ```yaml
   services:
     taskflow-server:
       image: YOUR_DOCKERHUB_USERNAME/taskflow-server:latest
       container_name: taskflow-server
       restart: unless-stopped
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - PORT=5000
       env_file:
         - ./server/.env.production
       volumes:
         - server_logs:/app/logs
       networks:
         - taskflow-network
       healthcheck:
         test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
         interval: 30s
         timeout: 10s
         retries: 3
         start_period: 40s
        
     taskflow-client:
       image: YOUR_DOCKERHUB_USERNAME/taskflow-client:latest
       container_name: taskflow-client
       restart: unless-stopped
       ports:
         - "80:80"
       depends_on:
         taskflow-server:
           condition: service_healthy
       volumes:
         - client_logs:/var/log/nginx
       networks:
         - taskflow-network
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost/"]
         interval: 30s
         timeout: 10s
         retries: 3
         start_period: 40s
        
   networks:
     taskflow-network:
       driver: bridge
      
   volumes:
     server_logs:
     client_logs:
   ```

3. **Build and Push Images**
   ```bash
   # Build images
   docker build -t YOUR_DOCKERHUB_USERNAME/taskflow-server:latest ./server
   docker build -t YOUR_DOCKERHUB_USERNAME/taskflow-client:latest ./client
   
   # Push to Docker Hub
   docker login
   docker push YOUR_DOCKERHUB_USERNAME/taskflow-server:latest
   docker push YOUR_DOCKERHUB_USERNAME/taskflow-client:latest
   ```

### Local Docker Development

```bash
# Run with docker-compose
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## ☁️ AWS EC2 Deployment

### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS (Free Tier)
3. **Instance Type**: t2.micro (Free Tier) or t2.small
4. **Key Pair**: Create new or use existing
5. **Security Group**: Configure with these rules:
   ```
   Type        Port    Source          Description
   SSH         22      Your IP         SSH access
   HTTP        80      0.0.0.0/0       Frontend access  
   Custom TCP  5000    0.0.0.0/0       Backend API
   ```
6. **Storage**: 8GB (default)
7. **Launch Instance**

### Step 2: Connect and Configure EC2

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update && sudo apt-get install -y docker-ce

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Verify installation
docker --version && docker-compose --version
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/chongwongus/TaskFlow-student-project-management.git
cd TaskFlow-student-project-management

# Create production environment file
cat > server/.env.production << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
GOOGLE_CLIENT_ID=your_google_client_id
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
EOF

# Update docker-compose.yml with your Docker Hub username
# Pull and start containers
docker-compose pull
docker-compose up -d

# Check status
docker-compose ps
```

### Step 4: Configure Production URLs

Update these files for production:

1. **Client API Configuration** (`client/src/services/api.tsx`):
   ```typescript
   const API_URL = process.env.NODE_ENV === 'production'
     ? 'http://YOUR_EC2_IP:5000/api'
     : 'http://localhost:5000/api';
   ```

2. **Server CORS Configuration** (`server/server.js`):
   ```javascript
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? [
           'http://YOUR_EC2_IP',
           'http://YOUR_EC2_IP:80',
           'https://YOUR_EC2_IP'
         ]
       : 'http://localhost:3000',
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

3. **Update OAuth Redirect URLs**:
   - Google OAuth: Add `http://YOUR_EC2_IP` to authorized origins
   - GitHub OAuth: Update callback to `http://YOUR_EC2_IP/github/callback`

### Step 5: SSL/HTTPS Setup (Recommended)

For production, set up SSL with Let's Encrypt:

```bash
# Install Nginx and Certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/taskflow

# Enable site and get SSL certificate
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
sudo certbot --nginx -d your-domain.com
```

## 🧪 Testing

### API Testing
```bash
# Test server health
curl http://YOUR_EC2_IP:5000/

# Test registration
curl -X POST http://YOUR_EC2_IP:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Frontend Testing
1. Navigate to `http://YOUR_EC2_IP`
2. Test user registration and login
3. Create a project and add tasks
4. Verify all features work correctly

### Automated Testing
```bash
# Backend tests
cd server && npm test

# Frontend tests  
cd client && npm test
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user profile

### Project Management
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add team member

### Task Management  
- `GET /api/tasks/project/:projectId` - Get project tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### GitHub Integration
- `GET /api/github/repositories` - Get user repositories
- `GET /api/github/repository/:owner/:repo` - Get repository details
- `POST /api/projects/:id/github` - Connect repository to project

## 🛠️ Troubleshooting

### Common Issues

#### CORS Errors
- Verify `CLIENT_URL` is set correctly in backend `.env`
- Check that frontend API URL matches backend URL
- Ensure EC2 security group allows the required ports

#### Docker Container Issues
```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs service-name

# Restart containers
docker-compose restart

# Rebuild containers
docker-compose down && docker-compose up --build -d
```

#### Database Connection Issues
- Verify MongoDB connection string format
- Check that EC2 IP is whitelisted in MongoDB Atlas
- Test connection with MongoDB Compass

#### Authentication Issues
- Verify Google/GitHub OAuth redirect URLs
- Check that environment variables are set correctly
- Ensure JWT secret is consistent across deployments

### Performance Monitoring
```bash
# Check system resources
htop
df -h

# Monitor Docker containers
docker stats

# View application logs
docker-compose logs -f --tail=100
```

## 🔄 Deployment Updates

### Updating the Application
```bash
# Local: Build and push new images
docker build -t YOUR_DOCKERHUB_USERNAME/taskflow-server:latest ./server
docker build -t YOUR_DOCKERHUB_USERNAME/taskflow-client:latest ./client
docker push YOUR_DOCKERHUB_USERNAME/taskflow-server:latest
docker push YOUR_DOCKERHUB_USERNAME/taskflow-client:latest

# EC2: Pull and restart
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
cd TaskFlow-student-project-management
docker-compose pull
docker-compose down
docker-compose up -d
```

### Backup and Maintenance
```bash
# Database backup (if using self-hosted MongoDB)
mongodump --uri="your_mongodb_connection_string"

# Clean up Docker resources
docker system prune -a

# Update system packages
sudo apt-get update && sudo apt-get upgrade -y
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files with real credentials
2. **AWS Security Groups**: Restrict access to specific IPs when possible
3. **Strong Passwords**: Use complex passwords for all services
4. **Regular Updates**: Keep Docker images and system packages updated
5. **SSL/HTTPS**: Use SSL certificates in production
6. **Database Security**: Enable MongoDB authentication and use Atlas for managed security
7. **JWT Security**: Use strong, unique JWT secrets
8. **API Rate Limiting**: Implement rate limiting for production APIs

## 🤝 Contributing

This is a course project for TCSS 506. For team members:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Workflow
- Use feature branches for new functionality
- Write descriptive commit messages
- Test thoroughly before submitting PRs
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Academic Context

This project was developed as part of:
- **Course**: TCSS 506 - Practical Full Stack Development
- **Institution**: University of Washington Tacoma
- **Program**: Graduate Certificate in Software Development Engineering (GC-SDE)
- **Quarter**: Spring 2025

## 🙏 Acknowledgements

- **Ling-Hong Hung** - Research Assistant Professor, School of Engineering and Technology
- **Charlie LeWarne** - Course Support and Guidance
- **MongoDB Atlas** - Database hosting
- **Google Cloud Platform** - OAuth services
- **GitHub** - Version control and API integration
- **AWS** - Cloud hosting and deployment
- **Docker** - Containerization platform

## 📞 Support

For technical support or questions:
1. Check the [troubleshooting section](#-troubleshooting)
2. Review container logs: `docker-compose logs service-name`
3. Verify environment variables and configurations
4. Contact team members for project-specific issues

---

**🚀 Ready to deploy? Follow the setup instructions above and get TaskFlow running in your environment!**
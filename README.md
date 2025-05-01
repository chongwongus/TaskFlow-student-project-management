# Web Application Project - TCSS 506

## Project Overview
This repository contains our group project for TCSS 506 Web Development Course. We've designed and implemented a fully-functional web application with user authentication, database integration, and external API connectivity, deployed using Docker containers on AWS EC2.

## Team Members
- Preston Harms
- Richard Le
- Jannine G. D. MacGormain

## Project Description
The TaskFlow will be a standalone web application developed as a course project.
The project aims to collaboratively plan, design, and deploy a web application while applying the MVC (Model-View-Controller) design pattern and other design methodologies to enhance the project's modularity.
The application will utilize MongoDB for database management, React Typescript for frontend development, the Flask Python web application framework for development, and will be deployed on Amazon Web Services (AWS). It will incorporate external APIs to enhance user experience, such as accessing GitHub’s API for repository information.
The TaskFlow application will be containerized using Docker for efficient deployment.
The app will track project progress, task completion, and team collaboration, allowing users to create and manage projects, assign tasks to team members, and monitor deadlines through an intuitive interface.

## Features
- **User Authentication System**: Complete login/registration functionality with secure session management
- **Interactive UI**: Responsive design with intuitive user interface
- **Database Integration**: [Mention your chosen database] for data storage and retrieval
- **External API Integration**: Real-time data from [mention the API you're using]
- **Docker Containerization**: Containerized deployment for consistent development and production environments

## Technology Stack
- **Frontend**: [List technologies - e.g., HTML5, CSS3, JavaScript, React, etc.]
- **Backend**: [List technologies - e.g., Node.js, Express, Django, etc.]
- **Database**: [Your chosen database - e.g., MongoDB, PostgreSQL, etc.]
- **Deployment**: Docker, AWS EC2
- **Version Control**: Git, GitHub

## Project Structure
```
project-root/
│
├── frontend/         # Frontend code
│   ├── public/       # Static files
│   └── src/          # Source files
│
├── backend/          # Backend code
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # Application routes
│   └── config/       # Configuration files
│
├── database/         # Database configuration
│
├── docker/           # Docker configuration files
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── docs/             # Documentation
    └── planning.md   # Project planning document
```

## Installation & Setup

### Prerequisites
- Node.js [version]
- Docker [version]
- [Other prerequisites]

### Local Development
1. Clone the repository
   ```
   git clone https://github.com/yourusername/repository-name.git
   cd repository-name
   ```

2. Install dependencies
   ```
   # For frontend
   cd frontend
   npm install

   # For backend
   cd ../backend
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development servers
   ```
   # For backend
   cd backend
   npm run dev

   # For frontend
   cd frontend
   npm start
   ```

### Running with Docker
1. Build and run the Docker containers
   ```
   docker-compose up --build
   ```

2. Access the application at `http://localhost:[port]`

## Deployment
Our application is deployed on AWS EC2 using Docker containers. Access it at:
[Deployment URL]

## Project Planning
The project planning document is available [here](link-to-planning-document).

## API Documentation
[Brief description of the APIs used/created in your project]

## Testing
Run tests with:
```
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Contributing
This is a course project for CS506. Contributions from team members are managed through GitHub issues and pull requests.

## License
[Your chosen license]

## Acknowledgements
- Ling-Hong Hung, Research Assistant Professor, School of Engineering and Technology

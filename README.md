# TaskFlow

## Web Application Project - TCSS 506

## Project Overview

This repository contains our group project for TCSS 506 Web Development Course. We've designed and implemented a fully-functional web application with user authentication, database integration, and external API connectivity, deployed using Docker containers on AWS EC2.

## Team Members

- Preston Harms
- Richard Le
- Jannine G. D. MacGormain

## Project Description

TaskFlow is a standalone web application developed as a course project. The application is designed to help student teams track project progress, task completion, and team collaboration. Users can create and manage projects, assign tasks to team members, and monitor deadlines through an intuitive interface.

The project aims to collaboratively plan, design, and deploy a web application while applying the MVC (Model-View-Controller) design pattern and other design methodologies to enhance the project's modularity.

## Features

- **User Authentication System**: Complete login/registration functionality with Google OAuth integration
- **Project Management**: Create, edit, and manage projects with team members
- **Task Management**: Create, assign, and track tasks with different status categories
- **Interactive UI**: Responsive design with intuitive user interface
- **Database Integration**: MongoDB for data storage and retrieval
- **External API Integration**: GitHub API integration for repository linking and issue tracking
- **Docker Containerization**: Containerized deployment for consistent development and production environments

## Technology Stack

- **Frontend**: React, TypeScript, SCSS, React Router
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas
- **Authentication**: JWT, Google OAuth
- **External APIs**: GitHub API
- **Deployment**: Docker, AWS EC2
- **Version Control**: Git, GitHub

## Project Structure

```plaintext
project-root/
│
├── frontend/           # React TypeScript frontend
│   ├── public/         # Static files
│   └── src/            # Source files
│       ├── components/ # React components
│       ├── pages/      # Page components
│       ├── services/   # API services
│       └── context/    # React context (auth, etc.)
│
├── backend/            # Node.js Express backend
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   ├── services/       # External service integrations
│   └── config/         # Configuration files
│
├── docker/             # Docker configuration files
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── docs/               # Documentation
    └── planning.md     # Project planning document
```

## Installation & Setup

### Prerequisites

- Node.js v14+
- npm v6+
- MongoDB account (for MongoDB Atlas)
- Google Developer account (for OAuth)
- GitHub account (for API integration)
- Docker (optional, for containerized deployment)

### Environment Setup for Team Collaboration

#### MongoDB Atlas Setup

Our project uses MongoDB Atlas as the database. To connect to our shared development database:

1. Request access to the shared MongoDB Atlas cluster from a team member
2. You will receive the connection string in this format:

   ```plaintext
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskflow
   ```

3. Replace `<username>` and `<password>` with the credentials provided to you

#### Google OAuth Setup

For Google authentication integration:

1. Request access to the shared Google Cloud project from a team member
2. You will be provided with the Google Client ID
3. For local development, make sure to use `http://localhost:3000` in your browser

### Local Development

1. Clone the repository

   ```plaintext
   git clone https://github.com/chongwongus/TaskFlow-student-project-management.git
   cd TaskFlow-student-project-management
   ```

2. Frontend setup

   ```bash
   # Navigate to frontend directory
   cd client
   
   # Install dependencies
   npm install
   
   # Create .env file
   cp .env.example .env
   ```

3. Update the frontend `.env` file with your credentials:

   ```plaintext
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_CLIENT_ID=<your_google_client_id>
   ```

4. Backend setup

   ```bash
   # Navigate to backend directory
   cd ../server
   
   # Install dependencies
   npm install
   
   # Create .env file
   cp .env.example .env
   ```

5. Update the backend `.env` file with your credentials:

   ```plaintext
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskflow
   JWT_SECRET=<your_jwt_secret_key>
   JWT_EXPIRE=30d
   GOOGLE_CLIENT_ID=<your_google_client_id>
   GITHUB_CLIENT_ID=<your_github_client_id>
   GITHUB_CLIENT_SECRET=<your_github_client_secret>
   ```

6. Start the development servers

   Backend:

   ```bash
   # In the backend directory
   cd server
   npm run dev
   ```

   Frontend:

   ```bash
   # In the frontend directory
   cd client
   npm start
   ```

7. Access the application at `http://localhost:3000`

### Running with Docker (Optional)

If you prefer using Docker for development:

1. Build and run the Docker containers

   ```plaintext
   docker-compose up --build
   ```

2. Access the application at `http://localhost:3000`

## Secure Credential Sharing for Team Members

To securely share credentials within the team:

1. **Never commit .env files** containing actual credentials to the repository
2. Use the provided `.env.example` files as templates
3. Share actual credentials through secure channels:
   - Password manager (LastPass, 1Password, etc.)
   - Encrypted messaging (Signal, WhatsApp)
   - Secure team communication tools (Slack direct messages)
4. Each team member should maintain their own `.env` files with the shared credentials
5. If you need access to credentials, contact one of the team members

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Projects

- `GET /api/projects` - Get all projects for user
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `POST /api/projects/:id/members` - Add a member to a project

### Tasks

- `GET /api/tasks/project/:projectId` - Get all tasks for a project
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### GitHub Integration

- `GET /api/github/repositories` - Get user's GitHub repositories
- `GET /api/github/repository/:owner/:repo` - Get repository details
- `GET /api/github/repository/:owner/:repo/issues` - Get repository issues

## Testing

Run tests with:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Troubleshooting

### MongoDB Connection Issues

- Verify your IP address is in the MongoDB Atlas whitelist
- Check that your username and password are correct
- Ensure the connection string format is correct

### Google OAuth Issues

- Verify the correct Google Client ID is in your .env file
- Ensure `http://localhost:3000` is added to authorized JavaScript origins
- Check browser console for any CORS or authorization errors

### API Connection Issues

- Verify the backend server is running on port 5000
- Check that CORS is properly configured in the backend
- Ensure the frontend is using the correct API URL

## Contributing

This is a course project for TCSS 506. Contributions from team members are managed through GitHub issues and pull requests.

## License

MIT License

## Acknowledgements

- Ling-Hong Hung, Research Assistant Professor, School of Engineering and Technology

# Meta80: High-Quality Film Discovery Platform

Meta80 is a full-stack web application designed to help film enthusiasts discover and explore critically acclaimed movies with Metacritic scores of 80 or higher. This project leverages the MEAN stack to provide a comprehensive and user-friendly platform for movie exploration.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- Comprehensive database of critically acclaimed films (Metacritic score ≥ 80)
- User authentication system with personalized watchlists and viewed lists
- Advanced filtering and sorting capabilities based on genres, decades, countries, and directors
- Dynamic recalculation of movie counts in response to applied filters
- Pagination and dynamic loading for enhanced performance
- Responsive design with a modern UI implemented using Angular Material

## Technologies Used
### Frontend
- Angular
- TypeScript
- RxJS
- Angular Material

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### DevOps & Deployment
- Google Cloud App Engine
- MongoDB Atlas

### Other Tools
- Python (for initial data scraping and processing)

## Project Structure
```
meta80/
│
├── frontend/        # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── environments/
│   ├── angular.json
│   └── package.json
│
├── backend/         # Node.js backend
│   ├── public/      # Compiled Angular files
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── scripts/         # Python scripts for data collection
│
├── deploy.sh        # Deployment script for Google Cloud App Engine
└── README.md
```

## Setup and Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/meta80.git
   cd meta80
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory
   - Add necessary environment variables (MongoDB URI, session secret, etc.)

4. Set up the database:
   - Ensure MongoDB is installed and running
   - Run the data collection scripts in the `scripts` directory

5. Build the frontend:
   ```
   cd frontend
   ng build --prod
   ```
   This will create a `dist` folder in the frontend directory. Copy the contents of this folder to the `backend/public` directory.

## Running the Application
To run the entire application (both frontend and backend):

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run the development script:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5000`

This single command will serve both the backend API and the frontend application.

## API Documentation
The backend provides RESTful API endpoints for movie data retrieval and user operations. Key endpoints include:

- `GET /api/movies`: Retrieve movies with optional filtering
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/user/watchlist`: Add/remove movies from watchlist
- `POST /api/user/seenlist`: Add/remove movies from viewed list

For detailed API documentation, refer to the `backend/src/routes` directory.

## Deployment
The application is deployed on Google Cloud App Engine. To deploy:

1. Ensure you have the Google Cloud SDK installed and configured
2. Run the deployment script:
   ```
   ./deploy.sh
   ```

This script handles the process of uploading and deploying your application to Google Cloud App Engine.

## Contributing
Contributions to Meta80 are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
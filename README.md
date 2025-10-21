# WTWR (What to Wear?): Back End

## About the Project
WTWR (What to Wear?) is a weather-based clothing recommendation service. This repository contains the backend implementation for the WTWR application, providing a RESTful API that manages user profiles and clothing items. The service allows users to add clothing items suitable for different weather conditions, like or unlike items, and maintain their virtual wardrobe.

## Technologies and Techniques Used
- **Express.js**: Web application framework
- **MongoDB**: Database management using mongoose ODM
- **REST API**: Architecture style for networked applications
- **Error Handling**: Centralized error handling with status codes
- **Input Validation**: Request validation using mongoose schemas
- **MVC Pattern**: Model-View-Controller architecture

## Running the Project
- `npm run start` — to launch the server 
- `npm run dev` — to launch the server with the hot reload feature

## API Endpoints

### Authentication
- `POST /signin` - Sign in to the application
  - Request body: `{ email, password }`
- `POST /signup` - Register a new user
  - Request body: `{ name, avatar, email, password }`

### Users
- `GET /users` - Returns a list of all users
- `GET /users/me` - Returns the current user's profile
- `PATCH /users/me` - Update current user's profile
  - Request body: `{ name, avatar }`

### Clothing Items
- `GET /items` - Returns all clothing items
- `GET /items/:itemId` - Returns a specific item by ID
- `POST /items` - Creates a new clothing item
  - Request body: `{ name, weather, imageUrl }`
- `DELETE /items/:itemId` - Deletes a specific item
- `PUT /items/:itemId/likes` - Adds user's like to an item
- `DELETE /items/:itemId/likes` - Removes user's like from an item

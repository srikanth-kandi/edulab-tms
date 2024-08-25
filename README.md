# Task Management System (TMS)

A comprehensive Task Management System API built with Node.js, Express, TypeORM, and PostgreSQL, designed to manage tasks and user organizations with varying levels of access and permissions.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Starting the Application](#starting-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Organization Management](#organization-management)
  - [Task Management](#task-management)
- [Admin vs. User Permissions](#admin-vs-user-permissions)
- [Troubleshooting](#troubleshooting)

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/srikanth-kandi/edulab-tms
   cd edulab-tms
   ```

2. Install dependencies

   ```bash
   npm install
   ```

## Setup

1. Create a `.env` file in the root directory of the project

   ```makefile
   DB_HOST=your_database_host
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret_key
   ```

2. Run database migrations to set up the database schema

   ```bash
   npm run migration:run
   ```

## Starting the Application

```bash
npm start
```

## API Documentation

### Authentication

1.  Register a new user

    - URL: [`/register`](https://tms.srikanthkandi.me/register)
    - Method: `POST`
    - Request Body:
      Use either `orgName` or `existingOrgId` but not both. Username needs to unique across the users irrespective of the organization. Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.

      ```json
      {
        "username": "string",
        "password": "string",
        "orgName": "string", // Optional, use if you want to create a new organization
        "existingOrgId": number // Optional, use if you want to join an existing organization
      }
      ```

    - Response: If `orgName` is provided, a new organization will be created and role will be set to "admin". If `existingOrgId` is provided, the user will be added to the existing organization and role will be set to "user".

      ```json
      {
        "message": "User registered successfully",
        "user": {
          "username": "string",
          "password": "hashedPassword",
          "role": "string", // "user" or "admin"
          "organization": {
              "id": number,
              "name": "orgName",
              "createdAt": "timestamp"
          },
          "id": number
        }
      }
      ```

2.  Login

    - URL: [`/login`](https://tms.srikanthkandi.me/login)
    - Method: `POST`
    - Request Body:

      ```json
      {
        "username": "string",
        "password": "string"
      }
      ```

    - Response: Will check validations like username and password are required, user exists, and password is correct. If all validations pass, a JWT token will be generated and will be valid for 1 hour.

      ```json
      {
        "token": "jwt_token"
      }
      ```

### User Management

1. Create user

   - URL: [`/users`](https://tms.srikanthkandi.me/users)
   - Method: `POST`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Request Body: Only admin users can create new users. Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.

     ```json
     {
       "username": "string",
       "password": "string",
       "role": "string" // "user" or "admin"
     }
     ```

   - Response:

     ```json
     {
       "id": number,
       "username": "string",
       "role": "string", // "user" or "admin"
     }
     ```

2. Get all users

   - URL: [`/users`](https://tms.srikanthkandi.me/users)
   - Method: `GET`
   - Headers:
     ```yaml
     Authorization: Bearer <token>
     ```
   - Response: Only users in the current organization will be returned for both "admin" and "user" roles.

     ```json
     [
        {
            "id": number,
            "username": "string",
            "password": "hashedPassword",
            "role": "string" // "user" or "admin"
        }
     ]
     ```

3. Get user by ID

   - URL: [`/users/:id`](https://tms.srikanthkandi.me/users/1)
   - Method: `GET`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Response: Only users in the current organization will be returned for both "admin" and "user" roles.

     ```json
     {
       "id": number,
       "username": "string",
       "role": "string", // "user" or "admin"
       "orgId": number,
       "orgName": "string"
     }
     ```

4. Update user

   - URL: [`/users`](https://tms.srikanthkandi.me/users)
   - Method: `PUT`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Request Body: admin users can update other users in same organization. If there is only one admin user in the organization and the user is trying to change to user role, it will throw an error.

     ```json
     {
       "id": number,
       "username": "string",
       "password": "string",
       "role": "string" // "user" or "admin"
     }
     ```

   - Response:

     ```json
     {
       "id": number,
       "username": "string",
       "role": "string" // "user" or "admin"
     }
     ```

5. Delete user

   - URL: [`/users/:id`](https://tms.srikanthkandi.me/users/1)
   - Method: `DELETE`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Response: If the deleting user is the only admin user in the organization, it will throw an error.

     ```json
     {
       "message": "User deleted"
     }
     ```

### Organization Management

1. Update organization

   - URL: [`/organizations`](https://tms.srikanthkandi.me/organizations)
   - Method: `PUT`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Request Body: Only admins of the organization can update the organization name.

     ```json
     {
       "name": "new-org-name"
     }
     ```

   - Response:

     ```json
     {
        "id": number,
        "name": "new-org-name"
     }
     ```

### Task Management

1. Get all tasks

   - URL: [`/tasks`](https://tms.srikanthkandi.me/tasks)
   - Method: `GET`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Response: when admin user is logged in, all user's tasks of the organization will be returned. when user is logged in, only their tasks will be returned.

     ```json
     [
       {
         "id": number,
         "title": "string",
         "description": "string",
         "status": "string", // "pending", "in-progress", "completed"
         "userId": number
       }
     ]
     ```

2. Get task by ID

   - URL: [`/tasks/:id`](https://tms.srikanthkandi.me/tasks/1)
   - Method: `GET`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Response: admin user can get any task in the organization. user can get only their tasks.

     ```json
     {
       "id": number,
       "title": "string",
       "description": "string",
       "status": "string", // "pending", "in-progress", "completed"
       "userId": number
     }
     ```

3. Create task

   - URL: [`/tasks`](https://tms.srikanthkandi.me/tasks)
   - Method: `POST`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Request Body: when the admin user want to create to task for other user in their organization, `adminReqUserId` should be provided.

     ```json
     {
       "title": "string",
       "description": "string",
       "status": "string", // "pending", "in-progress", "completed"
       "adminReqUserId": number // optional, only admin users can create tasks for other users
     }
     ```

   - Response:

     ```json
     {
       "id": number,
       "title": "string",
       "description": "string",
       "status": "string", // "pending", "in-progress", "completed"
     }
     ```

4. Update task

   - URL: [`/tasks/:id`](https://tms.srikanthkandi.me/tasks/1)
   - Method: `PUT`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Request Body: admins can update any task in the organization. users can update only their tasks.

     ```json
     {
       "id": number,
       "title": "string",
       "description": "string",
       "status": "string" // "pending", "in-progress", "completed"
     }
     ```

   - Response:

     ```json
     {
       "id": number,
       "title": "string",
       "description": "string",
       "status": "string" // "pending", "in-progress", "completed"
     }
     ```

5. Delete task

   - URL: [`/tasks/:id`](https://tms.srikanthkandi.me/tasks/1)
   - Method: `DELETE`
   - Headers:

     ```yaml
     Authorization: Bearer <token>
     ```

   - Response: admins can delete any task in the organization. users can delete only their tasks.

     ```json
     {
       "message": "Task deleted successfully"
     }
     ```

## Admin vs. User Permissions

| Endpoint         | Method     | Admin Access | User Access |
| ---------------- | ---------- | ------------ | ----------- |
| `/register`      | **POST**   | ✔️           | ✔️          |
| `/login`         | **POST**   | ✔️           | ✔️          |
| `/users`         | **POST**   | ✔️           | ❌          |
| `/users`         | **GET**    | ✔️           | ✔️          |
| `/users/:id`     | **GET**    | ✔️           | ✔️          |
| `/users`         | **PUT**    | ✔️           | ✔️ (self)   |
| `/users/:id`     | **DELETE** | ✔️           | ✔️ (self)   |
| `/organizations` | **PUT**    | ✔️           | ❌          |
| `/tasks`         | **GET**    | ✔️           | ✔️ (self)   |
| `/tasks/:id`     | **GET**    | ✔️           | ✔️ (self)   |
| `/tasks`         | **POST**   | ✔️           | ✔️          |
| `/tasks/:id`     | **PUT**    | ✔️           | ✔️ (self)   |
| `/tasks/:id`     | **DELETE** | ✔️           | ✔️ (self)   |

## Troubleshooting

- **Database Connection Issues**: Ensure your `.env` file has the correct database credentials and your PostgreSQL server is running.
- **JWT Secret Errors**: Make sure your .env file contains a valid JWT_SECRET.
- **Permission Denied**: Double-check that your user roles are correctly assigned and that you are passing the correct JWT tokens in the headers.

# CRM Calendar Service

This project is a CRM Calendar Service built with Node.js, Express, and TypeScript. It integrates with Google Calendar to manage calendar events.

## Table of Contents

- Installation
- Usage
- Scripts
- Environment Variables
- API Documentation
- Testing
- License

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/crm-calendar-service.git
    cd crm-calendar-service
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/0) file in the root directory and add the required environment variables (see Environment Variables).

4. Build the project:
    ```sh
    npm run build
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. For development, use:
    ```sh
    npm run dev
    ```

The server will start on the port specified in the [.env](http://_vscodecontentref_/1) file (default is `4002`).

## Scripts

- `npm start`: Runs the built application.
- `npm run dev`: Starts the application in development mode using `nodemon`.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run test:unit`: Runs unit tests with coverage.
- `npm run test:integration`: Runs integration tests with coverage.
- `npm run test:all`: Runs both unit and integration tests with coverage.

## Environment Variables

The following environment variables are required:

- **Google OAuth**
  - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
  - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
  - `GOOGLE_CALLBACK_URL`: The callback URL for Google .

OAuth- **JWT**
  - `JWT_SECRET`: Secret key for JWT.
  - `JWT_EXPIRATION`: JWT token expiration time.

- **GitHub**
  - `GITHUB_TOKEN`: GitHub token for accessing private packages.

- **Frontend**
  - `FRONTEND_URL`: URL of the frontend application.

- **Calendar**
  - `SHARED_CALENDAR_ID`: ID of the shared Google Calendar.
  - `GOOGLE_CALENDAR_KEY_FILE`: Path to the Google Calendar service account key file.
  - `REDIRECT_URI`: Redirect URI for Google OAuth.

- **Server**
  - `PORT`: Port on which the server will run.

Example [.env](http://_vscodecontentref_/2) file:
```properties
#Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=/auth/google/callback
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=2h

GITHUB_TOKEN=your-github-token

FRONTEND_URL=http://localhost:3000

#Calendar
SHARED_CALENDAR_ID=your-shared-calendar-id
GOOGLE_CALENDAR_KEY_FILE=src/utils/service-account.json
REDIRECT_URI=http://localhost:4002/auth/google/callback

#Server
PORT=4002
```

## API Documentation
API documentation is available via Swagger. Once the server is running, you can access the documentation at:
```
http://localhost:4002/docs
```
## Testing
To run tests, use the following commands:
    - Unit tests
    ```
    npm run test:unit
    ```
    - Integration tests
    ```
    npm run test:integration
    ```
    - All tests
    ```
    npm run test:all
    ```
"E-Learning Platform Application with Courses
Technologies:
Frontend - React, Vite.js, Chakra-UI
Backend - Node.js Express.js Multer
Database - MongoDB
Storage - AWS S3
How to Run:
Local Setup:
To run the project, an AWS S3 account and MongoDB Atlas or appropriate environment variables are required.
After cloning the repository and opening it in Visual Studio Code, the command:
npm run build
will install the required dependencies.
Before running the server, create an .env file with the following environment variables:
PORT - port on which the server will run (default 5000)
MONGO_URI - MongoDB database connection string
JWT_SECRET - JSON web token secret, used for authentication
AWS_ACCESS_KEY_ID - AWS API keys
AWS_SECRET_ACCESS_KEY
AWS_REGION - AWS region
AWS_BUCKET_NAME - S3 bucket name
Then you can start the server:
npm run start
Users can create an account and log in. Browse courses and their details, and search for courses by title, author, or description. In course details, they can view course lectures.
Logged-in users can create their own courses and browse courses they've enrolled in or created, as well as enroll in courses.
As an author, they can delete and edit courses. They also have the ability to create their own lectures by uploading PDF files to AWS S3, editing them, and deleting them.
Users enrolled in a course can download PDFs associated with lectures.
Additionally, responsiveness has been ensured.
The goal of this project was for me to learn Node.js and improve my knowledge of React."

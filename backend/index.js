import express from 'express';
import connectDB from './db.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Define allowed origins
// const allowedOrigins = ['https://scriptstorm1-1.onrender.com/', 'http://localhost:5173'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or Postman)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true
// };

// Apply CORS middleware
app.use(cors({origin:'https://scriptstorm1-1.onrender.com', credentials:true , methods:["GET","HEAD","PUT","PATCH","POST","DELETE"], allowedHeaders:'content-type' }));

connectDB();
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/comment', commentRoutes);

// app.use(express.static(path.join(__dirname, '/frontend/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

app.listen(3000, () => {
  console.log(`Server is running on Port 3000!`);
});

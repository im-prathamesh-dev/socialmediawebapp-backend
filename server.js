const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');


dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment');
  process.exit(1);
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  }

  // middlewares
  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // routes (consider /api/auth for auth routes)
  app.use('/api', loginRoute);
  app.use('/api', registerRoute);
  app.use('/api', userRoute);
  app.use('/api/posts', postRoute);


  app.get('/', (req, res) => {
    res.status(200).send('Server is running');
  });

  const server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  // graceful shutdown
  const shutDown = () => {
    console.log('Shutting down server...');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('Mongo connection closed');
        process.exit(0);
      });
    });
  };
  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);
}

start();

module.exports = app;
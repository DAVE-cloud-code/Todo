require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRoutes);

mongoose.connect('mongodb://localhost:27017/todoapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

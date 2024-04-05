const mongoose = require('mongoose');

async function db() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/newTaskManager');
    console.log('db connected');
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = db;

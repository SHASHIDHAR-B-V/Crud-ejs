const express = require('express');
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

let taskRouter = express.Router();

//getTasks is a handler function
taskRouter.get('/task', getTasks);
taskRouter.post('/task', createTask);
taskRouter.get('/task/:id', getTask);
taskRouter.put('/task/:id', updateTask);
taskRouter.delete('/task/:id', deleteTask);

module.exports = taskRouter;

let Task = require('../models/task');

//get tasks
let getTasks = async (req, res) => {
  try {
    let tasks = await Task.find();
    if (!tasks) {
      return res.status(400).json({
        status: 'fail',
        message: 'there is no task to display',
      });
    }
    res.render('home', { tasks, title: 'home' });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

//create task

let createTask = async (req, res) => {
  console.log(req.body);
  try {
    let { task } = req.body;
    if (!task) {
      return res.status(400).json({
        status: 'fail',
        message: 'task is required',
      });
    }
    let newTask = new Task({
      task: task,
    });
    await newTask.save();
    res.redirect('/api/v1/taskManager/task');
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

//getTask------------

let getTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    let task = await Task.findById(id);
    if (!task) {
      return res.status(400).json({
        status: 'fail',
        message: 'there is no task to display',
      });
    }
    res.render('update', { task });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
//updateTask------------

let updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;
    console.log(id);
    let updatedTask = await Task.findByIdAndUpdate(
      id,
      { task: task },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(400).json({
        status: 'fail',
        message: 'there is no task to updated',
      });
    }
    res.redirect('/api/v1/taskManager/task');
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

//delete task

let deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    let deletedTasks = await Task.findByIdAndDelete(id);
    if (!deletedTasks) {
      return res.status(400).json({
        status: 'fail',
        message: 'here is no task to deleted',
      });
    }
    res.redirect('/api/v1/taskManager/task');
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'deleted',
    });
  }
};

module.exports = { getTasks, createTask, getTask, updateTask, deleteTask };

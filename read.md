// step 1 creating a server.js and create a server------

const http = require('http');

const server = http.createServer();

server.listen(5000, () => {
console.log('server running in 5k');
});

//-------------------------------------

//step 2 create app.js-----

const express = require('express');

let app = express();

module.exports = app;

//server.js
//require app in server.js
//const server = http.createServer(app);

//server.js
const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen(5000, () => {
console.log('server running in 5k');
});

//-----------------------------------------

//step 3-----
//now create 3 folder
//models , taskController, routes ,

// models - task.js--
//install mongoose
//require mongoose
//create a taskSchema

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
task: {
type: string,
},
});
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

//controller - taskController

let Task = require('../models/task');

let getTasks = async () => {
try {
let tasks = await Task.find();
if (!tasks) {
return res.status(400).json({
status: 'fail',
message: 'there is no task to display',
});
}
res.status(201).json({
status: 'success',
data: {
tasks,
},
});
} catch (error) {
res.status(500).json({
status: 'fail',
message: error.message,
});
}
};

module.exports = { getTasks };

//routes - taskRouter.js

const express = require('express');
const { getTasks } = require('../controllers/taskController');

let taskRouter = express.Router();

taskRouter.get('/task', getTasks);

//----------------------------------------

//step 4 ---
//create a config folder and db.js file
//for mongo db connectivity

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

//step 5

const express = require('express');
const taskRouter = require('./routes/taskRouter');

const db = require('./config/db');
db();

let app = express();

//middleware

app.use(express.json());
//The app.use(express.json()) middleware in Express.js is used to parse incoming request bodies in JSON format. It allows your Express application to automatically parse JSON data included in the body of incoming requests, making it available as req.body in your route handlers.

app.use('/api/v1/taskManager', taskRouter);

module.exports = app;

//--------------------------

//step 6------------------------

after this go to postman and paste url
http://localhost:8000/api/v1/taskManager/task

if any data present it will show or else empty array will display

//step 7 ----- develop other crud operations

//createTask//create task

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
res.status(201).json({
status: 'success',
data: {
task,
},
});
} catch (error) {
res.status(500).json({
status: 'fail',
message: error.message,
});
}
};

module.exports = { getTasks, createTask };

//postman url http://localhost:8000/api/v1/taskManager/task

schema to type in body-raw-json

{
"task": "shashi"
}

//----------------------------------

//step 8 get single task by id

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
res.status(201).json({
status: 'success',
data: {
task,
},
});
} catch (error) {
res.status(500).json({
status: 'fail',
message: error.message,
});
}
};

module.exports = { getTasks, createTask, getTask };

//--------------------------------------------

//step 9-----------------------
let updateTask = async (req, res) => {
try {
const { id } = req.params;
const { task } = req.body;

    let updatedTasks = await Task.findByIdAndUpdate(
      id,
      { task: task },
      { new: true }
    );
    if (!updatedTasks) {
      return res.status(400).json({
        status: 'fail',
        message: 'ther is  no task to display',
      });
    }
    res.status(201).json({
      status: 'success',
      data: {
        updateTask,
      },
    });

} catch (error) {
res.status(500).json({
status: 'fail',
message: error.message,
});
}
};

//step 10 Deleted Task

//delete task
let deleteTask = async (req, res) => {
try {
const { id } = req.params;

    let deletedTasks = await Task.findByIdAndDelete(id);
    if (!deletedTasks) {
      return res.status(400).json({
        status: 'fail',
        message: 'ther is  no task to display',
      });
    }
    res.status(201).json({
      status: 'success',
      data: {
        deletedTasks,
      },
    });

} catch (error) {
res.status(500).json({
status: 'fail',
message: 'deleted',
});
}
};

//--------------------------------

//now lets make it to display as HTML using EJS
//install ejs
https://ejs.co
//create a folder name view and create home.ejs and update.ejs

//create public folder/css folder/ styles.css

//step 1

//app.js-----updates

const express = require('express');
const taskRouter = require('./routes/taskRouter');

const db = require('./config/db');
db();

let app = express();

//for ejs
app.set('view engine', 'ejs');

//middlewares

app.use(express.json());
//for using static web page
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

//base route
app.use('/api/v1/taskManager', taskRouter);

module.exports = app;

//first lets display home.js and get tasks only

//home.js

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task</title>
    <link rel="stylesheet" href="/public/css/styles.css" />
  </head>
  <body>
    <form action="" method="post">
      <input type="text" name="task" placeholder="Enter Task" />
      <button type="submit">add task</button>
    </form>
    <table>
      <h2>My Tasks</h2>
      <tr>
        <th>Task</th>
        <th>update</th>
        <th>Delete</th>
      </tr>
      <% tasks.forEach(doc => { %>
      <tr>
        <td><%= doc.task%></td>
      </tr>

      <% }) %>
    </table>

  </body>
</html>

//taskController for getTasks

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

//step 2

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

//step 3----
//initial update using getTask
//for update we need to install method-override using npm

app.js----

const express = require('express');
const taskRouter = require('./routes/taskRouter');

const db = require('./config/db');
db();

let app = express();

//for ejs
app.set('view engine', 'ejs');

//middlewares

app.use(express.json());
//for using static web page
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

//base route
app.use('/api/v1/taskManager', taskRouter);

module.exports = app;

//update getTask as Update

<table>
      <h2>My Tasks</h2>
      <tr>
        <th>Task</th>
        <th>update</th>
        <th>Delete</th>
      </tr>
      <% tasks.forEach(doc => { %>
      <tr>
        <td><%= doc.task%></td>

        <td>
          <button class="update-btn">
            <a href="/api/v1/taskManager/task/<%= doc.id %>">Update</a>
          </button>
        </td>
      </tr>

      <% }) %>
    </table>

    //taskController
    //get task

let getTask = async (req, res) => {
// console.log(req.params.id);
try {
const { id } = req.params;
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

//other controllers

let Task = require('../models/Task');

//get all Tasks
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
// let newTask = await Task.create({
// task: task,
// });

    //or----
    let newTask = new Task({
      task: task,
    });
    await newTask.save();
    res.redirect('/api/v1/taskRouter/task');

} catch (error) {
res.status(500).json({
status: 'fail',
message: error.message,
});
}
};

//get task
let getTask = async (req, res) => {
// console.log(req.params.id);
try {
const { id } = req.params;
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

//update task
let updateTask = async (req, res) => {
try {
const { id } = req.params;
const { task } = req.body;

    let updatedTasks = await Task.findByIdAndUpdate(
      id,
      { task: task },
      { new: true }
    );
    if (!updatedTasks) {
      return res.status(400).json({
        status: 'fail',
        message: 'there is  no task to update',
      });
    }

    res.redirect('/api/v1/taskRouter/task');

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
        message: 'there is  no task to delete',
      });
    }
    res.redirect('/api/v1/taskRouter/task');

} catch (error) {
res.status(500).json({
status: 'fail',
message: 'deleted',
});
}
};
module.exports = { getTasks, createTask, getTask, updateTask, deleteTask };


//hom.ejs

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= title%></title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <h1>Create Task</h1>
    <form action="" method="post">
      <input type="text" name="task" placeholder="enter your task" />
      <button type="submit">add task</button>
    </form>
    <table>
      <h2>My Tasks</h2>
      <tr>
        <th>Task</th>
        <th>Update</th>
        <th>Delete</th>
      </tr>

      <!-- getting it from task router get task -->
      <% tasks.forEach(doc => {%>
      <tr>
        <td><%= doc.task%></td>

        <td>
          <button class="update-btn">
            <a href="/api/v1/taskManager/task/<%= doc._id%>">Update</a>
          </button>
        </td>

        <td>
          <form
            action="/api/v1/taskManager/task/<%= doc._id%>?_method=DELETE"
            method="post"
          >
            <button class="delete-btn" type="submit">delete</button>
          </form>
        </td>

        <%})%>
      </tr>
    </table>
  </body>
</html>


//update.ejs

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <h2>Update task</h2>
    <form
      action="/api/v1/taskManager/task/<%= task._id%>?_method=PUT"
      method="post"
    >
      <input type="text" name="task" value="<%= task.task %>" />
      <button class="update-btn" type="submit">update task</button>
    </form>
  </body>
</html>

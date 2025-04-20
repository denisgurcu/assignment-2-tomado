const express = require('express');
const cors = require('cors'); // allows communication between frontend and backend
const path = require('path');
const bodyParser = require('body-parser');

// import our route handlers
const tasksRouter = require('./routers/tasks');
const categoriesRouter = require('./routers/categories');

const app = express();
// this makes the uploaded files available to the frontend
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// set the port where the server will run
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
// route setup 
app.use('/tasks', tasksRouter);
app.use('/categories', categoriesRouter);

// start the server and listen on the port we specified above
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

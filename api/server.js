const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const tasksRouter = require('./routers/tasks');
const categoriesRouter = require('./routers/categories');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/tasks', tasksRouter);
app.use('/categories', categoriesRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

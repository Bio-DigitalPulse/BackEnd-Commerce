const express = require('express');
const routes = require('./routes');
// Import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(routes);

// Sequelize database and connect server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
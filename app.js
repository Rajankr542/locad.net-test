require('./models/User');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const requireAuth = require('./middlewares/requireAuth');
const jwt = require('jsonwebtoken');
var cors = require('cors');
const app = express();

app.use(cors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "allowedHeaders": "Access-Control-Allow-Origin, Content-Type, Authorization"
    }
));

app.use(bodyParser.json());

//test server
const mongoUri="mongodb://localhost:27017/loactd-test";


mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true

});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', err => {
  console.error('Error connecting to mongo', err);
});


const userAPI = require("./routes/api/userApi");
const productApi = require("./routes/api/productApi");

app.use(authRoutes);
app.use("/api/user-api", userAPI);
app.use("/api/product", productApi);

app.get("*", (req,res) => {
  res.status(400).send(
    {
      status: 0,
      message: 'This request does not have any endpoint'
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

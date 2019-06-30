import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Welcome Home');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

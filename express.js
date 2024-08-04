const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 80;
myServer.listen(80, ()=> console.log("Server started"));
app.use(bodyParser.json());
app.use(express.static('public')); 
app.post('/register', (req, res) => {
    const { username, contact } = req.body;
    fs.appendFileSync('users.txt', `${username} ${contact}\n`);
    res.send('Registration successful!');
});
app.listen(80, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

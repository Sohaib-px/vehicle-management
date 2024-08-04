const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;
myServer.listen(8000, ()=> console.log("Server started"));
app.use(bodyParser.json());
app.use(express.static('public')); 
app.post('/register', (req, res) => {
    const { username, contact } = req.body;
    fs.appendFileSync('users.txt', `${username} ${contact}\n`);
    res.send('Registration successful!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

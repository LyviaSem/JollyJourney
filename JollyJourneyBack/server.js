const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/api/message', (req, res) => {
    const message = 'Hello world from the back';
    res.json({ message });
});

app.listen(port, () => {
    console.log('serveur démarré')
});
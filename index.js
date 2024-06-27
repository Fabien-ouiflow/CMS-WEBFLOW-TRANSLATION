const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global pour parser le body en JSON
app.use(express.json());

function processString(data) {
    let result = data.replace(/'/g, ' ');       // Remplace toutes les apostrophes par un espace
    result = result.replace(/"/g, '\\"');       // Ajoute un antislash avant chaque guillemet double
    return result;
}

// Conserver l'endpoint '/modify-html' comme spécifié
app.post('/modify-html', (req, res) => {
    if (req.body.translations && req.body.translations.length > 0 && req.body.translations[0].text) {
        let htmlContent = req.body.translations[0].text;
        htmlContent = htmlContent.replace(/'/g, ' ');
        let jsonResponse = JSON.stringify(htmlContent);
        res.send(jsonResponse);
    } else {
        res.status(400).send('Invalid request data');
    }
});

// Modifier l'endpoint '/process-text' pour accepter du texte brut
app.post('/process-text', express.text(), (req, res) => {
    console.log(req.body)
    if (req.body) {
        const processedText = processString(req.body);
        res.send(processedText);
    } else {
        res.status(400).send('Invalid request datadddd');
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

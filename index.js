const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le body en JSON
app.use(express.json());

// Fonction pour traiter la chaîne de caractères
function processString(data) {
    let result = data.replace(/"/g, '\\"');  // Ajoute un antislash avant chaque guillemet double
    result = result.replace(/'/g, ' ');      // Remplace toutes les apostrophes par un espace
    return result;
}

// Endpoint pour modifier du HTML selon les règles spécifiées
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

// Nouvel endpoint pour traiter la chaîne de caractères selon processString
app.post('/process-text', (req, res) => {
    if (req.body.translations && req.body.translations.length > 0 && req.body.translations[0].text) {
        const processedText = processString(req.body.translations[0].text);
        res.json({ processedText });
    } else {
        res.status(400).send('Invalid request data');
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

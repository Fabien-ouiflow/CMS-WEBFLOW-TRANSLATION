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
    console.log(req.body);  // Pour déboguer et voir ce que le serveur reçoit

    // Vérifie si req.body est exactement le chiffre 0
    if (req.body === '0') {
        res.send('0');  // Retourne juste un espace
    }
    // Vérifie que req.body est une chaîne et non vide
    else if (typeof req.body === 'string' && req.body.trim() !== '') {
        const processedText = processString(req.body);
        res.send(processedText);
    } else {
        // Renvoie un message personnalisé si le corps de la requête est vide
        res.status(400).send('Le contenu de cette ligne CMS est vide.');
    }
});




// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

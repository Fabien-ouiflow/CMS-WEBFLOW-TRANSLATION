const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global pour parser le body en JSON
app.use(express.json());

// Fonction pour traiter les chaînes dans /process-text
function processString(data) {
  // Remplacer les guillemets doubles
  let result = data.replace(/"/g, '\\"'); 
  // Remplacer les sauts de ligne par \n
  result = result.replace(/\r?\n/g, "\\n");
  return result;
}

app.post("/modify-html", (req, res) => {
  if (req.body === 0) {
    res.send("0"); 
  } else if (
    req.body.translations &&
    req.body.translations.length > 0 &&
    req.body.translations[0].text
  ) {
    let htmlContent = req.body.translations[0].text;

    // Remplacer les apostrophes droites et typographiques
    htmlContent = htmlContent.replace(/'/g, "&#x27;").replace(/’/g, "&#x27;");

    let jsonResponse = JSON.stringify(htmlContent);
    res.send(jsonResponse);
  } else {
    res.status(400).send("Invalid request data");
  }
});

// Endpoint '/process-text' pour accepter du texte brut
app.post("/process-text", express.text(), (req, res) => {
  console.log("Requête reçue :", req.body);

  if (req.body === "0") {
    res.send("0"); 
  } else if (typeof req.body === "string" && req.body.trim() !== "") {
    // Traiter la chaîne avec gestion des \n
    const processedText = processString(req.body);
    res.send(processedText);
  } else {
    res.status(400).send("Le contenu de cette ligne CMS est vide.");
  }
});

app.post("/text-to-html", express.text(), (req, res) => {
  console.log("Requête reçue :", req.body)

  if (typeof req.body === "string" && req.body.trim() !== "") {
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;") 
        .replace(/'/g, "&#x27;")
        .replace(/"/g, "&quot;") 
    }

    // Transformer chaque ligne du texte en liste HTML
    let htmlContent = "<ul>\n" +
      req.body
        .split("\n") // Diviser par ligne
        .map(line => `  <li>${escapeHtml(line.trim())}</li>`) // Échapper le texte et transformer en <li>
        .join("\n") + 
      "\n</ul>"

    // Placer le HTML dans un objet JSON avec JSON.stringify
    const jsonResponse = JSON.stringify({ html: htmlContent })
    res.send(jsonResponse)
  } else {
    res.status(400).send("Le texte fourni est vide ou invalide.")
  }
})



// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

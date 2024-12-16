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

app.post("/text-to-html", express.text(), (req, res) => {
  console.log("Requête reçue :", req.body)

  if (typeof req.body === "string" && req.body.trim() !== "") {
    // Échapper les caractères problématiques dans le texte
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;") // Échapper le `&`
        .replace(/'/g, "&#x27;") // Échapper les apostrophes
        .replace(/"/g, "&quot;") // Échapper les guillemets doubles
    }

    // Transformer le texte brut en liste HTML
    let htmlContent = `<!DOCTYPE html><ul>` +
      req.body
        .split("\n") // Diviser par ligne
        .map(line => line.trim().replace(/^- /, "")) // Enlever le "- " au début de chaque ligne
        .map(line => `<li>${escapeHtml(line)}</li>`) // Transformer chaque ligne en <li>
        .join("") + // Joindre les éléments sans saut de ligne
      `</ul>`

    // Retourner uniquement le HTML brut
    res.send(htmlContent)
  } else {
    res.status(400).send("Le texte fourni est vide ou invalide.")
  }
})







// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global pour parser le body en JSON
app.use(express.json());

// Fonction pour traiter les chaînes dans /process-text
function processString(data) {
  let result = data.replace(/"/g, '\\"'); 
  result = result.replace(/\r?\n/g, "\\n");
  return result;
}
// Endpoint '/modify-html' pour accepter du texte brut
app.post("/modify-html", (req, res) => {
  if (req.body === 0) {
    res.send("0"); 
  } else if (
    req.body.translations &&
    req.body.translations.length > 0 &&
    req.body.translations[0].text
  ) {
    let htmlContent = req.body.translations[0].text;
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
    const processedText = processString(req.body);
    res.send(processedText);
  } else {
    res.status(400).send("Le contenu de cette ligne CMS est vide.");
  }
});

app.post("/text-to-html", express.text(), (req, res) => {
  console.log("Requête reçue :", req.body);

  if (typeof req.body === "string" && req.body.trim() !== "") {
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/'/g, "&#x27;")
        .replace(/"/g, "&quot;");
    }

    const type = req.query.type || "list";

    let htmlContent;
    if (type === "list") {
      htmlContent = `<!DOCTYPE html><ul>` +
        req.body
          .split("\n")
          .map(line => line.trim().replace(/^-\s*/, ""))
          .map(line => `<li>${escapeHtml(line)}</li>`)
          .join("") +
        `</ul>`;
    } else if (type === "paragraphs") {
      htmlContent = `<!DOCTYPE html>` +
        req.body
          .split("\n")
          .map(line => `<p>${escapeHtml(line.trim())}</p>`)
          .join("");
    } else {
      return res.status(400).send("Type de contenu non supporté. Utilisez 'list' ou 'paragraphs'.");
    }

    res.send(htmlContent);
  } else {
    res.status(400).send("Le texte fourni est vide ou invalide.");
  }
});



// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

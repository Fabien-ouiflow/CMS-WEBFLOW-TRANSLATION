const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global pour parser le body en JSON
app.use(express.json());

function processString(data) {
  // let result = data.replace(/'/g, "&#x27;"); 
  let result = data.replace(/"/g, '\\"'); 
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
    // Remplacer à la fois les apostrophes droites et typographiques
    htmlContent = htmlContent.replace(/'/g, "&#x27;").replace(/’/g, "&#x27;");
    let jsonResponse = JSON.stringify(htmlContent);
    res.send(jsonResponse);
  } else {
    res.status(400).send("Invalid request data");
  }
});

  

// Modifier l'endpoint '/process-text' pour accepter du texte brut
app.post("/process-text", express.text(), (req, res) => {
  console.log(req.body); 


  if (req.body === "0") {
    res.send("0"); 
  }

  else if (typeof req.body === "string" && req.body.trim() !== "") {
    const processedText = processString(req.body);
    res.send(processedText);
  } else {

    res.status(400).send("Le contenu de cette ligne CMS est vide.");
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

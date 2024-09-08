const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
let clothing = require("./data/clothing.json");
let clothingList = clothing.map((element) => {
	return `${element.size} ${element.color} ${element.description}`;
});
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
	res.render("home", {
		variableName: "Clothing for rent",
		ourStuff: clothingList,
	});
});

app.get("/inventory", (req, res) => {
	res.render("inventory", { data: clothing });
});

app.listen(port, (error) => {
	if (error) console.log("Error, can't start server", error);
	else console.log(`Server listening on http://localhost:${port}`);
});

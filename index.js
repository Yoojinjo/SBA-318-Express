const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello, World!");
}).post("/", (req, res) => {
	const { name } = req.body;
	res.send(`Hi, ${name}`);
});

app.listen(port, (error) => {
	if (error) console.log("Error, can't start server", error);
	else console.log(`Server listening on http://localhost:${port}`);
});

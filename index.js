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
app.use(bodyParser.urlencoded({ extended: true }));

//home page item list
app.get("/", (req, res) => {
	res.render("home", {
		variableName: "Clothing for rent",
		ourStuff: clothingList,
	});
});

//inventory control page
app.get("/inventory", (req, res) => {
	res.render("inventory", { data: clothing, errorMessage: "" });
});

//get values from add clothes form
app.post("/inventory", (req, res) => {
	console.log(req.body);
	const inputClothesId = req.body.clothesId;
	const inputClothesDescription = req.body.clothesDescription;
	const inputClothesColor = req.body.clothesColor;
	const inputClothesSize = req.body.clothesSize;
	const inputClothesPrice = req.body.clothesPrice;

	// Check if the ID already exists
	let isDuplicate = clothing.some((item) => item.id == inputClothesId);

	if (isDuplicate) {
		res.render("inventory", {
			data: clothing,
			errorMessage:
				"Clothes ID already exists. Please use a different ID.",
		});
	} else {
		// add values to clothing data
		clothing.push({
			id: inputClothesId,
			description: inputClothesDescription,
			color: inputClothesColor,
			size: inputClothesSize,
			price: inputClothesPrice,
			availability: "available",
			rentedTo: "",
		});
		res.render("inventory", { data: clothing, errorMessage: "" });
	}
});
// Rent out inventory
app.post("/rent", (req, res) => {
	let requestedclothesId = req.body.clothesId;
	clothing.forEach((clothing) => {
		if (clothing.id == requestedclothesId) {
			clothing.availability = "rented";
		}
	});
	res.render("inventory", {
		data: clothing,
		errorMessage: "",
	});
});

//return inventory
app.post("/return", (req, res) => {
	let requestedclothesId = req.body.clothesId;
	clothing.forEach((clothing) => {
		if (clothing.id == requestedclothesId) {
			clothing.availability = "available";
		}
	});
	res.render("inventory", {
		data: clothing,
		errorMessage: "",
	});
});

//search for id and then delete
app.post("/delete", (req, res) => {
	let requestedclothesId = req.body.clothesId;
	let i = 0;

	clothing.forEach((item) => {
		i++;
		if (item.id == requestedclothesId) {
			clothing.splice(i - 1, 1);
		}
	});

	res.render("inventory", {
		data: clothing,
		errorMessage: "",
	});
});
app.listen(port, (error) => {
	if (error) console.log("Error, can't start server", error);
	else console.log(`Server listening on http://localhost:${port}`);
});

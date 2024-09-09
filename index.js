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
	res.render("inventory", {
		data: clothing,
		errorMessage: "",
		inputValues: "",
	});
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
		return res.render("inventory", {
			data: clothing,
			errorMessage:
				"Clothes ID already exists. Please use a different ID.",
			inputValues: {
				clothesDescription: inputClothesDescription,
				clothesColor: inputClothesColor,
				clothesSize: inputClothesSize,
				clothesPrice: inputClothesPrice,
			},
		});
	}

	// Check that all fields are filled
	if (
		inputClothesId === "" ||
		inputClothesDescription === "" ||
		inputClothesColor === "" ||
		inputClothesSize === "" ||
		inputClothesPrice === ""
	) {
		return res.render("inventory", {
			data: clothing,
			errorMessage: "ALL Fields are required",
			inputValues: {
				clothesId: inputClothesId,
				clothesDescription: inputClothesDescription,
				clothesColor: inputClothesColor,
				clothesSize: inputClothesSize,
				clothesPrice: inputClothesPrice,
			},
		});
	}

	// add values to clothing data
	clothing.push({
		id: inputClothesId,
		description: inputClothesDescription,
		color: inputClothesColor,
		size: inputClothesSize,
		price: `$${inputClothesPrice}`,
		availability: "available",
		rentedTo: "",
	});
	res.render("inventory", {
		data: clothing,
		errorMessage: "",
		inputValues: "",
	});
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
		inputValues: "",
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
		inputValues: "",
	});
});

//search for id and then delete
app.post("/delete", (req, res) => {
	let requestedclothesId = req.body.clothesId;
	const indexToDelete = clothing.findIndex(
		(item) => item.id == requestedclothesId
	);

	if (indexToDelete !== -1) {
		clothing.splice(indexToDelete, 1); // Remove the item from the array
	}

	res.render("inventory", {
		data: clothing,
		errorMessage: "",
		inputValues: "",
	});
});
app.listen(port, (error) => {
	if (error) console.log("Error, can't start server", error);
	else console.log(`Server listening on http://localhost:${port}`);
});

const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
let customers = require("./data/customers.json");
let customerName = customers.name;
let clothing = require("./data/clothing.json");
let clothingList = clothing.map((element) => {
	return `${element.size} ${element.color} ${element.description}`;
});

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("views")); // where your CSS resides

//home page item list
app.get("/", (req, res) => {
	res.render("home", {
		variableName: "Clothing for rent",
		ourStuff: clothingList,
	});
});
// Middleware for the inventory view
function renderInventoryPage(req, res, next) {
	res.render("inventory", {
		data: req.clothing || clothing, // Replace `clothing` with data if necessary
		errorMessage: res.locals.errorMessage || "", // Error message or empty string
		inputValues: res.locals.inputValues || {}, // Input values or empty object
	});
}

//inventory control page
app.get("/inventory/", (req, res) => {
	res.render("inventory", {
		data: clothing,
		errorMessage: "",
		inputValues: "",
		customers: customers,
	});
});

//search for item by id
app.get("/inventory/:id", (req, res) => {
	const itemId = req.params.id;

	// Find the clothing item index with the matching ID
	const item = clothing.find((clothingItem) => clothingItem.id === itemId);

	if (item) {
		// Render the page with the specific item
		res.render("inventory", {
			data: [item],
			errorMessage: "",
			inputValues: "",
			customers: customers,
		});
	} else {
		// Render with an error message if the item is not found
		res.render("inventory", {
			data: clothing,
			errorMessage: "Item not found",
			inputValues: "",
			customers: customers,
		});
	}
});
//get values from add clothes form
app.post(
	"/inventory",
	(req, res, next) => {
		console.log(req.body);
		const inputClothesId = req.body.clothesId;
		const inputClothesDescription = req.body.clothesDescription;
		const inputClothesColor = req.body.clothesColor;
		const inputClothesSize = req.body.clothesSize;
		const inputClothesPrice = req.body.clothesPrice;

		// Check if the ID already exists
		let isDuplicate = clothing.some((item) => item.id == inputClothesId);
		if (isDuplicate) {
			(res.locals.errorMessage =
				"Clothes ID already exists. Please use a different ID."),
				(res.locals.inputValues = req.body);
			return next();
		}

		// Check that all fields are filled
		if (
			inputClothesId === "" ||
			inputClothesDescription === "" ||
			inputClothesColor === "" ||
			inputClothesSize === "" ||
			inputClothesPrice === ""
		) {
			res.locals.errorMessage = "All fields are required.";
			res.locals.inputValues = req.body; // Retain input values
			return next();
		}

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
		res.locals.errorMessage = "";
		res.locals.inputValues = {};
		next();
	},
	renderInventoryPage
);

// Rent out inventory
app.post("/rent", (req, res) => {
	let requestedclothesId = req.body.clothesId;
	const rentedTo = req.body.rentedTo; // Capture the customer name
	clothing.forEach((clothing) => {
		if (clothing.id == requestedclothesId) {
			clothing.availability = "rented";
			clothing.rentedTo = rentedTo;
		}
	});
	res.render("inventory", {
		data: clothing,
		errorMessage: "",
		inputValues: "",
		customers: customers,
	});
});

//return inventory
app.post("/return", (req, res) => {
	let requestedclothesId = req.body.clothesId;
	clothing.forEach((clothing) => {
		if (clothing.id == requestedclothesId) {
			clothing.availability = "available";
			clothing.rentedTo = "";
		}
	});
	res.render("inventory", {
		data: clothing,
		errorMessage: "",
		inputValues: "",
		customers: customers,
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
		customers: customers,
	});
});

// Route to get customer names
app.get("/customers", (req, res) => {
	res.json(customers);
});

app.listen(port, (error) => {
	if (error) console.log("Error, can't start server", error);
	else console.log(`Server listening on http://localhost:${port}`);
});

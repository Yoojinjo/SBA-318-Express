const express = require("express");
const app = express();
const port = 3000;

const inventory = require("./routes/inventory");

const bodyParser = require("body-parser");
let customers = require("./data/customers.json");

let clothing = require("./data/clothing.json");
let clothingList = clothing.map((element) => {
	return `${element.size} ${element.color} ${element.description}`;
});

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("views")); // where CSS resides
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//home page item list
app.get("/", (req, res) => {
	try {
		res.status(200).render("home", {
			variableName: "Clothing for rent",
			ourStuff: clothingList,
		});
	} catch (error) {
		console.error("Error on home page:", error);
		res.status(500).send("An error occurred while loading the page.");
	}
});
// Middleware for the inventory view
function renderInventoryPage(req, res, next) {
	res.render("inventory", {
		data: req.clothing || clothing, // Replace `clothing` with data if necessary
		errorMessage: res.locals.errorMessage || "", // Error message or empty string
		inputValues: res.locals.inputValues || {}, // Input values or empty object
		customers: customers,
	});
}
//Routes
app.use("/inventory", inventory);

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

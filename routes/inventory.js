const express = require("express");
const router = express.Router();

let customers = require("../data/customers.json");

let clothing = require("../data/clothing.json");

const bodyParser = require("body-parser");

// Middleware to parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse application/json
router.use(bodyParser.json());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(express.static("views")); // where CSS resides
// Middleware for the inventory view
function renderInventoryPage(req, res, next) {
	res.render("inventory", {
		data: req.clothing || clothing, // Replace `clothing` with data if necessary
		errorMessage: res.locals.errorMessage || "", // Error message or empty string
		inputValues: res.locals.inputValues || {}, // Input values or empty object
		customers: customers,
	});
}

//inventory control page
router.get("/", (req, res) => {
	res.render("inventory", {
		data: clothing,
		errorMessage: "",
		inputValues: "",
		customers: customers,
	});
});

//search for item by id
router.get("/:id", (req, res) => {
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

//add items
//get values from add clothes form
router.post(
	"/",
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

//edit items
//get values from add clothes form
router.put(
	"/",
	(req, res, next) => {
		const {
			clothesId,
			clothesDescription,
			clothesColor,
			clothesSize,
			clothesPrice,
			clothesAvailability,
			clothesRentedTo,
		} = req.body;

		// Find the index of the item by ID
		const itemIndex = clothing.findIndex((item) => item.id == clothesId);

		if (itemIndex === -1) {
			res.locals.errorMessage = "Item not found";
			res.locals.inputValues = req.body;
			return next();
		}

		// Update the clothing item
		clothing[itemIndex] = {
			id: clothesId,
			description: clothesDescription,
			color: clothesColor,
			size: clothesSize,
			price: clothesPrice,
			availability: clothesAvailability,
			rentedTo: clothesRentedTo,
		};

		res.locals.errorMessage = "";
		res.locals.inputValues = {};
		next();
	},
	renderInventoryPage
);

// Rent out inventory
router.post("/rent", (req, res) => {
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
router.post("/return", (req, res) => {
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
router.post("/delete", (req, res) => {
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

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017'; // MongoDB connection URL
const dbName = 'recipeTest'; // Your database name

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the template engine

// Serve the form
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

// Handle form submission
app.post('/add-recipe', async (req, res) => {
    const { name, ingredients, cookingTime, servings } = req.body;
    const ingredientsArray = ingredients.split(',').map(ingredient => ingredient.trim()); // Split ingredients and trim spaces

    const client = new MongoClient(url);

    try {
        await client.connect(); // Connect to the MongoDB server
        const db = client.db(dbName);
        const collection = db.collection('recipes'); // Your collection name

        const document = {
            name,
            ingredients: ingredientsArray,
            cookingTime: parseInt(cookingTime),
            servings: parseInt(servings),
        };

        await collection.insertOne(document); // Insert the recipe document into the collection
        res.send({ message: 'Recipe added successfully!' }); // Send a JSON response
    } catch (err) {
        console.error('Error inserting document:', err);
        res.status(500).send({ message: 'Error adding recipe' }); // Send an error response
    } finally {
        await client.close(); // Ensure the client is closed
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

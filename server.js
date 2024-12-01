const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/473_final_project', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define schema and model for the 'Recipes' collection
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  servings: { type: Number, required: true },
  prepTime: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true }
}, { collection: 'Recipes' });

const Recipe = mongoose.model('Recipe', recipeSchema);

// Define schema and model for the 'Pantry' collection
const pantrySchema = new mongoose.Schema({
  itemName: { type: String, required: true }
}, { collection: 'Pantry' });

const Pantry = mongoose.model('Pantry', pantrySchema);

// Create a new recipe
app.post('/items', async (req, res) => {
  console.log('Request body:', req.body);

  const newRecipe = new Recipe(req.body);
  try {
    const savedRecipe = await newRecipe.save();
    console.log('Saved recipe:', savedRecipe);
    res.status(201).send(savedRecipe);
  } catch (err) {
    console.error('Error saving recipe:', err);
    res.status(400).send(err);
  }
});

// Get all recipes
app.get('/items', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).send(recipes);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Create a new pantry item
app.post('/pantry', async (req, res) => {
  console.log('Request body:', req.body);

  const newPantryItem = new Pantry(req.body);
  try {
    const savedPantryItem = await newPantryItem.save();
    console.log('Saved pantry item:', savedPantryItem);
    res.status(201).send(savedPantryItem);
  } catch (err) {
    console.error('Error saving pantry item:', err);
    res.status(400).send(err);
  }
});

// Get all pantry items
app.get('/pantry', async (req, res) => {
  try {
    const pantryItems = await Pantry.find();
    res.status(200).send(pantryItems);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a pantry item
app.delete('/pantry/:id', async (req, res) => {
  try {
    const result = await Pantry.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).send({ message: 'Item deleted' });
    } else {
      res.status(404).send({ message: 'Item not found' });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// Search recipes by ingredients
app.get('/search', async (req, res) => {
  const ingredients = req.query.ingredients.split(',');
  try {
    const recipes = await Recipe.find({ ingredients: { $all: ingredients } });
    res.status(200).send(recipes);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

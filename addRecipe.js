const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'; 
const dbName = 'recipeTest'; 

async function addRecipe(name, ingredients, cookingTime, servings) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to the database');

        const db = client.db(dbName);
        const collection = db.collection('recipes');

        const document = { 
            name, 
            ingredients, 
            cookingTime, 
            servings 
        };

        const result = await collection.insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);
    } catch (err) {
        console.error('Error inserting document:', err);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length < 4) {
    console.error('Please provide name, ingredients (comma-separated), cookingTime, and servings.');
    process.exit(1);
}

// Extract arguments
const name = args[0];
const ingredients = args[1].split(','); // Split the ingredients by comma
const cookingTime = parseInt(args[2]);
const servings = parseInt(args[3]);

// Call the addRecipe function
addRecipe(name, ingredients, cookingTime, servings)
    .catch(console.error);

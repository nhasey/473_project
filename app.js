const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'; 
const dbName = 'recipeTest'; 

async function main() {
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to the database');

        const db = client.db(dbName);
        const collection = db.collection('recipes'); // Replace with your collection name

        // Data to insert
        const document = { name: 'macaroni', ingredients: ['cheese', 'noodles'] };

        // Insert a document
        const result = await collection.insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

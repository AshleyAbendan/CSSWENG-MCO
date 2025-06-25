const { connectToDatabase, getDb } = require('./db'); // Adjust the path if needed

// Define the data to be inserted
const menuItems = [
    { category: 'Beef', name: 'Beef Caldereta', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Beef', name: 'Beef w/ Broccoli', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Beef', name: 'Roast Beef', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Beef', name: 'Beef Mushroom Steak', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Beef', name: 'Beef Stroganoff', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Beef', name: 'Beef Salpicao', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Pork', name: 'Lechon Orno', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Pork', name: 'BBQ Liempo', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Pork', name: 'Sweet & Sour Pork', mediumPrice: 3000, largePrice: 6000 },
    { category: 'Pork', name: 'Roast Pork', mediumPrice: 3200, largePrice: 6400 },
    { category: 'Pork', name: 'Pork Lengua (White Sauce)', mediumPrice: 3200, largePrice: 6400 },
    { category: 'Pork', name: 'Asadong Lengua', mediumPrice: 3200, largePrice: 6400 },
    { category: 'Chicken', name: 'Chicken Oriental', mediumPrice: 2000, largePrice: 3900 },
    { category: 'Chicken', name: 'Chicken Teriyaki', mediumPrice: 2000, largePrice: 3900 },
    { category: 'Chicken', name: 'Chicken Pastel', mediumPrice: 2200, largePrice: 4500 },
    { category: 'Chicken', name: 'Tropical Chicken', mediumPrice: 2200, largePrice: 4500 },
    { category: 'Chicken', name: 'Chicken Fingers', mediumPrice: 2200, largePrice: 4500 },
    { category: 'Chicken', name: 'Chicken Cordon Bleu', mediumPrice: 2700, largePrice: 5100 },
    { category: 'Fish/Seafood', name: 'Mix Seafood Salpicao', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Fish/Seafood', name: 'Kare-kareng Dagat', mediumPrice: 4000, largePrice: 7900 },
    { category: 'Fish/Seafood', name: 'Sisig Bangus', mediumPrice: 3600, largePrice: 7000 },
    { category: 'Fish/Seafood', name: 'Sweet & Sour Fish', mediumPrice: 2200, largePrice: 4500 },
    { category: 'Fish/Seafood', name: 'Fish Fillet w/ Garlic Dip', mediumPrice: 2200, largePrice: 4500 },
    { category: 'Fish/Seafood', name: 'Fish in Cream', mediumPrice: 2200, largePrice: 4500 },
    { category: 'Vegetable', name: 'Green Salad w/ Crispy Noodles', mediumPrice: 2300, largePrice: 4500 },
    { category: 'Vegetable', name: 'Lumpiang Ubod', mediumPrice: 1750, largePrice: 3200 },
    { category: 'Vegetable', name: 'Vegetable Gratin', mediumPrice: 1750, largePrice: 3200 },
    { category: 'Vegetable', name: 'Seafood Chop Suey', mediumPrice: 1750, largePrice: 3200 },
    { category: 'Pasta/Noodles', name: 'Carbonara', mediumPrice: 1800, largePrice: 3600 },
    { category: 'Pasta/Noodles', name: 'Creamy Tuna Pesto', mediumPrice: 2000, largePrice: 4000 },
    { category: 'Pasta/Noodles', name: 'Baked Mac', mediumPrice: 2200, largePrice: 4400 },
    { category: 'Pasta/Noodles', name: 'Lasagna', mediumPrice: 2200, largePrice: 4400 },
    { category: 'Pasta/Noodles', name: 'Japchae', mediumPrice: 1800, largePrice: 3600 }
];

async function seedDatabase() {
    await connectToDatabase();
    const db = getDb();
    const collection = db.collection('menuItems');

    try {
        const result = await collection.insertMany(menuItems);
        console.log(`${result.insertedCount} documents were inserted`);
    } catch (error) {
        console.error('Error inserting documents:', error);
    } finally {
        process.exit();
    }
}

seedDatabase();

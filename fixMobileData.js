const { connectDB, getDB } = require('./config/database');

async function fixMobileData() {
  try {
    await connectDB();
    console.log('Connected to database');

    const db = getDB();
    const mobilesCollection = db.collection('mobiles');

    const mobiles = await mobilesCollection.find({}).toArray();
    console.log(`Found ${mobiles.length} mobiles`);

    let updatedCount = 0;

    for (const mobile of mobiles) {
      const updates = {};

      if (typeof mobile.price === 'string') {
        updates.price = Number(mobile.price) || 0;
      }

      if (typeof mobile.stock === 'string') {
        updates.stock = Number(mobile.stock) || 0;
      }

      if (Object.keys(updates).length > 0) {
        await mobilesCollection.updateOne(
          { _id: mobile._id },
          { $set: updates }
        );
        updatedCount++;
        console.log(`Fixed ${mobile.brand} ${mobile.model}`);
      }
    }

    console.log(`\nCompleted! Updated ${updatedCount} mobile(s)`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixMobileData();

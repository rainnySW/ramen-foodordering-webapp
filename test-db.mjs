import mongoose from 'mongoose';

async function test() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in environment');
    process.exit(1);
  }
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Successfully connected to MongoDB!');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Available collections: ${collections.map(c => c.name).join(', ') || 'None (empty database)'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:');
    console.error(error);
    process.exit(1);
  }
}
test();

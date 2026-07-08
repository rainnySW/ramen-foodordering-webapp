import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import User from './models/User.js';
import dbConnect from './lib/mongodb.js';

async function test() {
  await dbConnect();
  
  // Create a user
  const user = await User.create({
    name: 'Test PUT',
    email: 'test@put.com',
    password: '123'
  });
  console.log('Created user:', user._id);
  
  // Simulate PUT request
  const updatedPrefs = { ThemeSetting: 'dark', LanguageSetting: 'th' };
  
  const updatedUser = await User.findByIdAndUpdate(
    user._id, 
    { preferences: updatedPrefs }, 
    { new: true, runValidators: true }
  );
  
  console.log('Updated user preferences:', updatedUser.preferences);
  
  await User.findByIdAndDelete(user._id);
  process.exit(0);
}
test();

import mongoose from 'mongoose';
import Menu from '../../models/Menu';
import { hardcodedMenu } from '../../lib/db';
import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST' || req.method === 'GET') {
    try {
      await dbConnect();
      
      await Menu.deleteMany({});
      
      const itemsToInsert = hardcodedMenu.map(({ _id, ...rest }) => rest);
      
      await Menu.insertMany(itemsToInsert);
      
      res.status(200).json({ message: 'Menu successfully seeded!', itemsInserted: itemsToInsert.length });
    } catch (error) {
      res.status(500).json({ message: 'Failed to seed database', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

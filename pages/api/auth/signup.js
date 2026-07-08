import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import crypto from 'crypto';

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  
  const { name, email, password, preferences } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const newUser = await User.create({
      name,
      email,
      password: hashPassword(password),
      isRegistered: true,
      tableNumber: null,
      orderCount: 0,
      ...(preferences && { preferences })
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

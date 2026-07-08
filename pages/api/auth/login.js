import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import crypto from 'crypto';

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = await User.findOne({ email, password: hashPassword(password) });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

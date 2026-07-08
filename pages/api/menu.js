import { getMenuItems } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const items = await getMenuItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching menu', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import dbConnect from './mongodb';
import Menu from '../models/Menu';
import Order from '../models/Order';

// Fallback in-memory data
let localOrders = [];
let localUsers = [];

export const hardcodedMenu = [
  { _id: '101', name: 'Inferno Spicy Ramen', name_th: 'ราเมงซุปเผ็ดพ่นไฟ ใส่เกี๊ยวโตๆ', price: 60, category: 'Ramen', image_url: '/menu/Inferno_Spicy_Ramen_with_Jumbo_Wontons.jpg', description: 'Spicy ramen with jumbo wontons.', description_th: 'ราเมนซุปรสเผ็ดจัดจ้านพร้อมเกี๊ยวหมูชิ้นโต' },
  { _id: '102', name: 'The Thorny King Bowl', name_th: 'ราเมงหนามสะท้านทรวง', price: 60, category: 'Ramen', image_url: '/menu/The_Thorny_King_Bowl_Ramen.jpg', description: 'Our massive signature thorny bowl.', description_th: 'ราเมนชามยักษ์ซิกเนเจอร์สูตรพิเศษ' },
  { _id: '103', name: 'Tom Yum Tempura & Hotate', name_th: 'ราเมงต้มยำกุ้งเทมปุระ x โฮตาเตะเบิร์นไฟ', price: 60, category: 'Ramen', image_url: '/menu/Tom_Yum_Shrimp_Tempura_&_Torched_Hotate_Ramen.jpg', description: 'Tom Yum broth with shrimp tempura and torched hotate.', description_th: 'ราเมนซุปต้มยำกุ้งเทมปุระและหอยเชลล์โฮตาเตะเบิร์นไฟ' },
  { _id: '104', name: 'Tongshin Signature Ramen', name_th: 'ทงชิน ซิกเนเจอร์ ราเมง', price: 50, category: 'Ramen', image_url: '/menu/Tongshin_Signature_Ramen.jpg', description: 'The classic Tongshin signature ramen.', description_th: 'ราเมนซิกเนเจอร์สูตรต้นตำรับทงชิน' },
  { _id: '105', name: 'Creamy Paitan Ramen', name_th: 'ราเมงซุปครีมมี่ไพทัน', price: 50, category: 'Ramen', image_url: '/menu/Creamy_Paitan_Ramen.jpg', description: 'Rich and creamy chicken paitan broth.', description_th: 'ราเมนซุปไก่ครีมมี่ไพทันรสกลมกล่อม' },
  { _id: '106', name: 'Fiery Sapporo Miso', name_th: 'ซัปโปโร มิโซะ รสจัดจ้าน', price: 50, category: 'Ramen', image_url: '/menu/Fiery_Sapporo_Miso_Ramen.jpg', description: 'Bold and spicy Sapporo style miso.', description_th: 'ราเมนซุปมิโซะสไตล์ซัปโปโรรสเผ็ดจัดจ้าน' },
  { _id: '107', name: 'Double Umami Matcha', name_th: 'ราเมงซุปชาเขียวเข้มค้นดับเบิ้ล อูมามิ', price: 60, category: 'Ramen', image_url: '/menu/Double_Umami_Rich_Matcha_Ramen.jpg', description: 'Rich matcha infused double umami broth.', description_th: 'ราเมนซุปมัทฉะอูมามิเข้มข้นคูณสอง' },
  { _id: '108', name: 'Shoga Tonkotsu Ramen', name_th: 'โชงะ ทงคตสึ ราเมง', price: 50, category: 'Ramen', image_url: '/menu/Shoga_Tonkotsu_Ramen.jpg', description: 'Ginger infused rich tonkotsu broth.', description_th: 'ราเมนซุปกระดูกหมูทงคตสึหอมกลิ่นขิง' },
  { _id: '109', name: 'Soryu Ramen', name_th: 'โซเรียวราเมง', price: 45, category: 'Ramen', image_url: '/menu/Soryu_Ramen.jpg', description: 'Clear and light Soryu style ramen.', description_th: 'ราเมนซุปใสสไตล์โซเรียว' },
  { _id: '110', name: 'Kamaboko Tsukemen', name_th: 'คามาโบโกะ ซึเคเมน', price: 50, category: 'Ramen', image_url: '/menu/Kamaboko_Tsukemen.jpg', description: 'Dipping noodles with rich kamaboko broth.', description_th: 'บะหมี่เย็นจุ่มซุปคามาโบโกะเข้มข้น' },
  { _id: '111', name: 'Gyoza', name_th: 'เกี๊ยวซ่า', price: 25, category: 'Sides', image_url: '/menu/Gyoza.jpg', description: 'Classic pan-fried pork dumplings.', description_th: 'เกี๊ยวซ่าหมูทอดสไตล์ญี่ปุ่น' },
  { _id: '112', name: 'Green Tea', name_th: 'ชาเขียว', price: 15, category: 'Drinks', image_url: '/menu/Green_Tea.jpg', description: 'Hot or cold refreshing green tea.', description_th: 'ชาเขียวญี่ปุ่น (ร้อน/เย็น)' }
];

export async function getMenuItems() {
  try {
    await dbConnect();
    const items = await Menu.find({});
    if (items.length === 0) return hardcodedMenu; // Return hardcoded if DB is empty
    return items;
  } catch (error) {
    console.error("Database connection failed. Falling back to local menu.", error);
    return hardcodedMenu;
  }
}

export async function createOrder(orderData) {
  try {
    await dbConnect();
    const newOrder = await Order.create(orderData);
    return newOrder;
  } catch (error) {
    console.error("Database connection failed. Saving order to local array.", error);
    const fallbackOrder = { _id: Date.now().toString(), ...orderData, status: 'Pending', created_at: new Date() };
    localOrders.push(fallbackOrder);
    return fallbackOrder;
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    await dbConnect();
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
    return updatedOrder;
  } catch (error) {
    console.error("Database connection failed. Updating local order status.", error);
    const orderIndex = localOrders.findIndex(o => o._id === orderId);
    if (orderIndex > -1) {
      localOrders[orderIndex].status = newStatus;
      return localOrders[orderIndex];
    }
    return null;
  }
}

export async function getActiveOrders() {
  try {
    await dbConnect();
    const orders = await Order.find({ status: { $ne: 'Served' } }).sort({ created_at: 1 });
    return orders;
  } catch (error) {
    console.error("Database connection failed. Returning local orders.", error);
    return localOrders.filter(o => o.status !== 'Served');
  }
}

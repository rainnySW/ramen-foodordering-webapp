
import mongoose from 'mongoose';
import Menu from './models/Menu.js';

const MONGODB_URI = process.env.MONGODB_URI;

const menuItems = [
  { name: 'Inferno Spicy Ramen', name_th: 'ราเมงซุปเผ็ดพ่นไฟ ใส่เกี๊ยวโตๆ', price: 60, category: 'Ramen', image_url: '/menu/Inferno_Spicy_Ramen_with_Jumbo_Wontons.jpg', description: 'Spicy ramen with jumbo wontons.', description_th: 'ราเมงซุปรสเผ็ดจัดจ้านพร้อมเกี๊ยวหมูชิ้นโต' },
  { name: 'The Thorny King Bowl', name_th: 'ราเมงหนามสะท้านทรวง', price: 60, category: 'Ramen', image_url: '/menu/The_Thorny_King_Bowl_Ramen.jpg', description: 'Our massive signature thorny bowl.', description_th: 'ราเมงชามยักษ์ซิกเนเจอร์สูตรพิเศษ' },
  { name: 'Tom Yum Tempura & Hotate', name_th: 'ราเมงต้มยำกุ้งเทมปุระ x โฮตาเตะเบิร์นไฟ', price: 60, category: 'Ramen', image_url: '/menu/Tom_Yum_Shrimp_Tempura_&_Torched_Hotate_Ramen.jpg', description: 'Tom Yum broth with shrimp tempura and torched hotate.', description_th: 'ราเมงซุปต้มยำกุ้งเทมปุระและหอยเชลล์โฮตาเตะเบิร์นไฟ' },
  { name: 'Tongshin Signature Ramen', name_th: 'ทงชิน ซิกเนเจอร์ ราเมง', price: 50, category: 'Ramen', image_url: '/menu/Tongshin_Signature_Ramen.jpg', description: 'The classic Tongshin signature ramen.', description_th: 'ราเมงซิกเนเจอร์สูตรต้นตำรับทงชิน' },
  { name: 'Creamy Paitan Ramen', name_th: 'ราเมงซุปครีมมี่ไพทัน', price: 50, category: 'Ramen', image_url: '/menu/Creamy_Paitan_Ramen.jpg', description: 'Rich and creamy chicken paitan broth.', description_th: 'ราเมงซุปไก่ครีมมี่ไพทันรสกลมกล่อม' },
  { name: 'Fiery Sapporo Miso', name_th: 'ซัปโปโร มิโซะ รสจัดจ้าน', price: 50, category: 'Ramen', image_url: '/menu/Fiery_Sapporo_Miso_Ramen.jpg', description: 'Bold and spicy Sapporo style miso.', description_th: 'ราเมงซุปมิโซะสไตล์ซัปโปโรรสเผ็ดจัดจ้าน' },
  { name: 'Double Umami Matcha', name_th: 'ราเมงซุปชาเขียวเข้มค้นดับเบิ้ล อูมามิ', price: 60, category: 'Ramen', image_url: '/menu/Double_Umami_Rich_Matcha_Ramen.jpg', description: 'Rich matcha infused double umami broth.', description_th: 'ราเมงซุปมัทฉะอูมามิเข้มข้นคูณสอง' },
  { name: 'Shoga Tonkotsu Ramen', name_th: 'โชงะ ทงคตสึ ราเมง', price: 50, category: 'Ramen', image_url: '/menu/Shoga_Tonkotsu_Ramen.jpg', description: 'Ginger infused rich tonkotsu broth.', description_th: 'ราเมงซุปกระดูกหมูทงคตสึหอมกลิ่นขิง' },
  { name: 'Soryu Ramen', name_th: 'โซเรียวราเมง', price: 45, category: 'Ramen', image_url: '/menu/Soryu_Ramen.jpg', description: 'Clear and light Soryu style ramen.', description_th: 'ราเมงซุปใสสไตล์โซเรียว' },
  { name: 'Kamaboko Tsukemen', name_th: 'คามาโบโกะ ซึเคเมน', price: 50, category: 'Ramen', image_url: '/menu/Kamaboko_Tsukemen.jpg', description: 'Dipping noodles with rich kamaboko broth.', description_th: 'บะหมี่เย็นจุ่มซุปคามาโบโกะเข้มข้น' },
  { name: 'Zaru Ramen', name_th: 'ซารุราเมง', price: 50, category: 'Ramen', image_url: '/menu/Zaru_Ramen.jpg', description: 'Authentic Japanese Zaru Ramen (Cold noodles).', description_th: 'ซารุราเมง บะหมี่เย็นสไตล์ญี่ปุ่น' },
  { name: 'Gyoza', name_th: 'เกี๊ยวซ่า', price: 25, category: 'Sides', image_url: '/menu/Gyoza.jpg', description: 'Classic pan-fried pork dumplings.', description_th: 'เกี๊ยวซ่าหมูทอดสไตล์ญี่ปุ่น' },
  { name: 'Green Tea', name_th: 'ชาเขียว', price: 15, category: 'Drinks', image_url: '/menu/Green_Tea.jpg', description: 'Hot or cold refreshing green tea.', description_th: 'ชาเขียวญี่ปุ่น (ร้อน/เย็น)' }
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('No MONGODB_URI found.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    
    console.log('Clearing old menu items...');
    await Menu.deleteMany({});
    
    console.log('Inserting new menu items...');
    await Menu.insertMany(menuItems);
    
    console.log('✅ Menu seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();

const { connectDB, getDB } = require('./config/database');

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const db = getDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('mobiles').deleteMany({});
    await db.collection('carts').deleteMany({});
    await db.collection('orders').deleteMany({});

    // Seed Users
    console.log('Seeding users...');
    const users = await db.collection('users').insertMany([
      {
        name: 'Admin User',
        email: 'admin@shop.com',
        password: 'admin123', // In production, hash this
        role: 'admin',
        phone: '1234567890',
        address: {
          street: '123 Admin St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'customer123', // In production, hash this
        role: 'customer',
        phone: '9876543210',
        address: {
          street: '456 Customer Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'customer123',
        role: 'customer',
        phone: '5551234567',
        address: {
          street: '789 Oak Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log(`Inserted ${users.insertedCount} users`);

    // Seed Mobiles
    console.log('Seeding mobiles...');
    const mobiles = await db.collection('mobiles').insertMany([
      {
        brand: 'Apple',
        model: 'iPhone 15 Pro',
        price: 999,
        specifications: {
          ram: '8GB',
          storage: '256GB',
          camera: '48MP Triple Camera',
          battery: '3274mAh',
          display: '6.1 inch OLED',
          processor: 'A17 Pro'
        },
        stock: 50,
        imageUrl: 'https://example.com/iphone15pro.jpg',
        description: 'Latest iPhone with advanced features and titanium design',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        price: 1199,
        specifications: {
          ram: '12GB',
          storage: '512GB',
          camera: '200MP Quad Camera',
          battery: '5000mAh',
          display: '6.8 inch Dynamic AMOLED',
          processor: 'Snapdragon 8 Gen 3'
        },
        stock: 30,
        imageUrl: 'https://example.com/galaxys24ultra.jpg',
        description: 'Premium Samsung flagship with S Pen',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'Google',
        model: 'Pixel 8 Pro',
        price: 899,
        specifications: {
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '5050mAh',
          display: '6.7 inch LTPO OLED',
          processor: 'Google Tensor G3'
        },
        stock: 40,
        imageUrl: 'https://example.com/pixel8pro.jpg',
        description: 'Google Pixel with advanced AI features',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'OnePlus',
        model: '12 Pro',
        price: 799,
        specifications: {
          ram: '16GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '5400mAh',
          display: '6.82 inch AMOLED',
          processor: 'Snapdragon 8 Gen 3'
        },
        stock: 25,
        imageUrl: 'https://example.com/oneplus12pro.jpg',
        description: 'Flagship killer with premium specs',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'Xiaomi',
        model: '14 Pro',
        price: 699,
        specifications: {
          ram: '12GB',
          storage: '512GB',
          camera: '50MP Leica Triple Camera',
          battery: '4880mAh',
          display: '6.73 inch AMOLED',
          processor: 'Snapdragon 8 Gen 3'
        },
        stock: 35,
        imageUrl: 'https://example.com/xiaomi14pro.jpg',
        description: 'Xiaomi flagship with Leica camera',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'Apple',
        model: 'iPhone 14',
        price: 699,
        specifications: {
          ram: '6GB',
          storage: '128GB',
          camera: '12MP Dual Camera',
          battery: '3279mAh',
          display: '6.1 inch OLED',
          processor: 'A15 Bionic'
        },
        stock: 60,
        imageUrl: 'https://example.com/iphone14.jpg',
        description: 'Previous generation iPhone at great value',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'Samsung',
        model: 'Galaxy A54',
        price: 449,
        specifications: {
          ram: '8GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '5000mAh',
          display: '6.4 inch Super AMOLED',
          processor: 'Exynos 1380'
        },
        stock: 80,
        imageUrl: 'https://example.com/galaxya54.jpg',
        description: 'Mid-range Samsung with premium features',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'Google',
        model: 'Pixel 7a',
        price: 499,
        specifications: {
          ram: '8GB',
          storage: '128GB',
          camera: '64MP Dual Camera',
          battery: '4385mAh',
          display: '6.1 inch OLED',
          processor: 'Google Tensor G2'
        },
        stock: 45,
        imageUrl: 'https://example.com/pixel7a.jpg',
        description: 'Affordable Pixel with flagship features',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'OnePlus',
        model: 'Nord 3',
        price: 399,
        specifications: {
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '5000mAh',
          display: '6.74 inch AMOLED',
          processor: 'MediaTek Dimensity 9000'
        },
        stock: 55,
        imageUrl: 'https://example.com/oneplusnord3.jpg',
        description: 'Budget-friendly OnePlus with great performance',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        brand: 'Xiaomi',
        model: 'Redmi Note 13 Pro',
        price: 299,
        specifications: {
          ram: '8GB',
          storage: '256GB',
          camera: '200MP Triple Camera',
          battery: '5100mAh',
          display: '6.67 inch AMOLED',
          processor: 'Snapdragon 7s Gen 2'
        },
        stock: 100,
        imageUrl: 'https://example.com/redminote13pro.jpg',
        description: 'Best value phone with 200MP camera',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log(`Inserted ${mobiles.insertedCount} mobiles`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@shop.com / admin123');
    console.log('Customer: john@example.com / customer123');
    console.log('Customer: jane@example.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

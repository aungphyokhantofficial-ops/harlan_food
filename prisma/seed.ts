import { prisma } from "../libs/prisma";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Adding admin user...");
  await prisma.adminUser.create({
    data: {
      email: "admin@gmail.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      lastLogin: new Date(),
      isActive: true,
    },
  });
  console.log("Admin user added successfully.");

  const openingHoursData = [
    { dayOfWeek: "Monday", openTime: "05:00 PM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "05:00 PM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "05:00 PM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "05:00 PM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "05:00 PM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "11:00 AM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: null, closeTime: null, isClosed: true },
  ];

  console.log("⏳ Seeding opening hours...");

  for (const hour of openingHoursData) {
    await prisma.openingHour.upsert({
      where: { dayOfWeek: hour.dayOfWeek },
      update: {
        openTime: hour.openTime,
        closeTime: hour.closeTime,
        isClosed: hour.isClosed,
      },
      create: hour,
    });
  }
  console.log("Seed success!");

  console.log("🌱 Menu Categories seeding စတင်နေပါပြီ...");

  const categories = [
    {
      name: "Daily Starters",
      menuType: "Daily",
      image: "https://harlanrestaurant.com/images/categories/1776939880_4ceafcd6-2535-4515-9e16-cb17c585920d.JPG",
    },
    {
      name: "Traditional Breakfast",
      menuType: "Morning",
      image: "https://harlanrestaurant.com/images/categories/1776939897_98baf2e2-c21b-4825-b726-b2a609b25307.JPG",
    },
    {
      name: "Main Courses",
      menuType: "Lunch",
      image: "https://harlanrestaurant.com/images/categories/1776756729_25bb7d3e-6fd9-4acc-9992-7204f3b2d824.jpeg",
    },
    {
      name: "Special Dinner",
      menuType: "Evening",
      image: "https://harlanrestaurant.com/images/categories/1777036541_Copy%20of%20Red%20Luxury%20Wine%20Menu%20(1).jpg",
    },
    {
      name: "Fresh Drinks",
      menuType: "Daily",
      image: "https://harlanrestaurant.com/images/categories/1777036541_Copy%20of%20Red%20Luxury%20Wine%20Menu%20(1).jpg",
    },
    {
      name: "Sweet Desserts",
      menuType: "Daily",
      image: "https://harlanrestaurant.com/images/categories/1777036589_Copy%20of%20Red%20Luxury%20Wine%20Menu.jpg",
    },
  ];

  for (const cat of categories) {
    // 💡 Schema မှာ unique မဟုတ်လို့ အရင်ရှိမရှိ စစ်တဲ့ logic ကို သုံးထားပါတယ်
    const existing = await prisma.menuCategory.findFirst({
      where: {
        name: cat.name,
        menuType: cat.menuType,
      },
    });

    if (!existing) {
      await prisma.menuCategory.create({
        data: {
          name: cat.name,
          menuType: cat.menuType,
          image: cat.image,
        },
      });
      console.log(`✅ Created category: ${cat.name}`);
    } else {
      console.log(`⏩ Skipped: ${cat.name} `);
    }
  }

  console.log("✨ Seeding");

  console.log("🌱 MenuItem seeding (with images) ");

  const menuItemsData = [
    {
      categoryName: "Daily Starters",
      menuType: "Daily",
      items: [
        {
          name: "Crispy Spring Rolls",
          price: 5500,
          description: "Fresh vegetables wrapped in crispy pastry",
          image: "https://images.unsplash.com/photo-1544333346-64e4fe1827ff",
        },
        {
          name: "Samosa Salad",
          price: 4000,
          description: "Traditional tea shop style samosa salad with cabbage",
          image: "https://images.unsplash.com/photo-1601050690597-df056fb01793",
        },
      ],
    },
    {
      categoryName: "Traditional Breakfast",
      menuType: "Morning",
      items: [
        {
          name: "Mohinga",
          price: 3500,
          description: "Iconic Burmese fish soup with rice noodles",
          image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f",
        },
        {
          name: "Nan Gyi Thoke",
          price: 4500,
          description: "Mandalay style thick rice noodle salad",
          image: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
        },
      ],
    },
    {
      categoryName: "Fresh Drinks",
      menuType: "Daily",
      items: [
        {
          name: "Iced Thai Milk Tea",
          price: 3500,
          description: "Authentic Thai tea with creamy milk",
          image: "https://images.unsplash.com/photo-1570197571499-166b36435e9f",
        },
        {
          name: "Lime Sparkling Soda",
          price: 2800,
          description: "Refreshing lime with soda and mint",
          image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
        },
      ],
    },
    {
      categoryName: "Sweet Desserts",
      menuType: "Daily",
      items: [
        {
          name: "Shwe Yin Aye",
          price: 4500,
          description: "Burmese coconut milk dessert with jelly and bread",
          image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
        },
      ],
    },
  ];

  for (const group of menuItemsData) {
    // ၁. Category ကို အရင်ရှာမယ်
    const category = await prisma.menuCategory.findFirst({
      where: {
        name: group.categoryName,
        menuType: group.menuType,
      },
    });

    if (category) {
      for (const item of group.items as any[]) {
        // ၂. Item ရှိမရှိ စစ်ပြီးမှ ထည့်မယ်
        const existingItem = await prisma.menuItem.findFirst({
          where: {
            name: item.name,
            menuCategoryId: category.id,
          },
        });

        if (!existingItem) {
          await prisma.menuItem.create({
            data: {
              name: item.name,
              price: item.price,
              description: item.description,
              image: item.image,
              isAvailable: true,
              menuCategoryId: category.id,
            },
          });
          console.log(`✅ Item: ${item.name} ကို ${group.categoryName}`);
        }
      }
    } else {
      console.log(`❌ Category: ${group.categoryName}`);
    }
  }

  console.log("✨ MenuItem Seeding အားလုံးပြီးပါပြီ။");

  const galleryItems = [
    // 1. Event Photos
    {
      title: "Grand Opening Night",
      type: "image",
      url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
      category: "Event",
    },
    // 2. Birthday Celebration (Video)
    {
      title: "Chef Harlan Birthday Surprise",
      type: "video",
      url: "https://www.youtube.com/watch?v=example1",
      category: "Birthday",
    },
    // 3. Private Party
    {
      title: "Exclusive Wine Tasting Party",
      type: "image",
      url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
      category: "Party",
    },
    // 4. Anniversary Event
    {
      title: "5th Year Anniversary Dinner",
      type: "image",
      url: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
      category: "Event",
    },
    // 5. Customer Birthday
    {
      title: "Guest Birthday Celebration",
      type: "image",
      url: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84",
      category: "Birthday",
    },
  ];

  console.log("⏳ Seeding Gallery Items...");

  for (const item of galleryItems) {
    await prisma.galleryItem.create({
      data: item,
    });
  }

  console.log("Start seeding contact messages...");

  const contactMessages = [
    {
      userName: "U Kyaw Kyaw",
      userEmail: "kyawkyaw@gmail.com",
      subject: "Inquiry about Private Party",
      message: "I would like to host a birthday party for 20 people next month. Do you have a private room?",
      isRead: false,
    },
    {
      userName: "Ms. Sarah Jones",
      userEmail: "sarah.j@example.com",
      subject: "Dietary Requirements",
      message: "Hello, I have a reservation tomorrow. Just wanted to confirm if you offer gluten-free options in the Tasting Menu.",
      isRead: true, // Admin ဖတ်ပြီးသားအဖြစ် နမူနာပြထားခြင်း
    },
    {
      userName: "Daw Nu Nu",
      userEmail: "nunu.pattaya@outlook.com",
      subject: "Career Opportunity",
      message: "I am a pastry chef with 5 years of experience. Are you currently hiring?",
      isRead: false,
    },
  ];

  for (const msg of contactMessages) {
    const createdMsg = await prisma.contactMessage.create({
      data: msg,
    });
    console.log(`Created message from: ${createdMsg.userName}`);
  }

  console.log("Seeding contact messages finished.");

  console.log("⏳ Seeding Reservations...");

  const reservations = [
    {
      bookingDate: "05/15/2024",
      bookingTime: "06:30 PM",
      guestsCount: 4,
      selectedMenu: "Tasting Menu",
      guestName: "U Ba Kaung",
      phoneNumber: "09123456789",
      email: "bakaung@gmail.com",
      specialNotes: "Allergic to peanuts. Prefer a window seat.",
      status: "confirmed",
      agreedToTerms: true,
      understoodLeadTime: true,
    },
    {
      bookingDate: "05/20/2024",
      bookingTime: "07:00 PM",
      guestsCount: 2,
      selectedMenu: "Daily Menu",
      guestName: "Daw Mya Mya",
      phoneNumber: "09987654321",
      email: "myamya@outlook.com",
      status: "pending",
      agreedToTerms: true,
      understoodLeadTime: true,
    },
    {
      bookingDate: "06/01/2024",
      bookingTime: "12:00 PM",
      guestsCount: 10,
      selectedMenu: "Sunday Menu",
      guestName: "Mr. John Doe",
      phoneNumber: "09444555666",
      email: "john.doe@example.com",
      otherContactId: "@johndoe_line",
      specialNotes: "Birthday celebration",
      status: "confirmed",
      agreedToTerms: true,
      understoodLeadTime: true,
    },
  ];

  for (const res of reservations) {
    await prisma.reservation.create({
      data: res,
    });
  }

  console.log("✅ Reservations Seeded!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

  const categories = [
    // 1. Daily Menu (နေ့စဉ်ရနိုင်သော မီနူး)
    { name: "Daily Starters", menuType: "Daily" },
    { name: "Main Courses", menuType: "Daily" },
    { name: "Side Dishes", menuType: "Daily" },

    // 2. Tasting Menu (အထူးမြည်းစမ်းမီနူး)
    { name: "Seasonal Bites", menuType: "Tasting" },
    { name: "Chef's Specials", menuType: "Tasting" },
    { name: "Wine Pairings", menuType: "Tasting" },

    // 3. Sunday Menu (တနင်္ဂနွေ အထူးမီနူး)
    { name: "Sunday Roast", menuType: "Sunday" },
    { name: "Brunch Selection", menuType: "Sunday" },
  ];

  console.log("⏳ Seeding Menu Categories...");

  for (const cat of categories) {
    // 💡 Schema မှာ name က @unique မဟုတ်တဲ့အတွက်
    // အရင်ရှိမရှိ စစ်ပြီးမှ ထည့်တဲ့ logic ကို သုံးပေးထားပါတယ်
    const existing = await prisma.menuCategory.findFirst({
      where: { name: cat.name, menuType: cat.menuType },
    });

    if (!existing) {
      await prisma.menuCategory.create({
        data: cat,
      });
    }
  }
  console.log("✅ Menu Categories Seeded!");

  console.log("⏳ Seeding Menu Items...");

  // ၁။ Category များကို နာမည်ဖြင့် ရှာဖွေရန် function
  const getCatId = async (name: string) => {
    const cat = await prisma.menuCategory.findFirst({ where: { name } });
    return cat?.id;
  };

  // ၂။ Data စုစည်းမှု (Category အလိုက် Item များ)
  const items = [
    // --- Daily Menu ---
    {
      name: "Classic Caesar Salad",
      description: "Romaine lettuce, parmesan, croutons with Caesar dressing",
      price: 450,
      catName: "Daily Starters",
    },
    {
      name: "Grilled Wagyu Striploin",
      description: "200g Wagyu beef with red wine jus and mashed potatoes",
      price: 2400,
      catName: "Main Courses",
    },

    // --- Tasting Menu ---
    {
      name: "Hokkaido Scallop Carpaccio",
      description: "Thinly sliced scallops with yuzu vinaigrette",
      price: 1200,
      catName: "Seasonal Bites",
    },
    {
      name: "Truffle Infused Risotto",
      description: "Creamy risotto with fresh black truffle shavings",
      price: 1800,
      catName: "Chef's Specials",
    },

    // --- Sunday Menu ---
    {
      name: "Traditional Roast Beef",
      description: "Slow-roasted beef with Yorkshire pudding and gravy",
      price: 1950,
      catName: "Sunday Roast",
    },
    {
      name: "Eggs Benedict Platter",
      description: "Poached eggs, smoked salmon on English muffins",
      price: 850,
      catName: "Brunch Selection",
    },
  ];

  // ၃။ Loop ပတ်ပြီး Database ထဲထည့်ခြင်း
  for (const item of items) {
    const categoryId = await getCatId(item.catName);

    if (categoryId) {
      await prisma.menuItem.upsert({
        where: { id: 0 }, // New record အနေနဲ့ပဲ အမြဲထည့်ချင်လျှင် (သို့မဟုတ် name ဖြင့်စစ်နိုင်သည်)
        update: {},
        create: {
          name: item.name,
          description: item.description,
          price: item.price,
          isAvailable: true,
          categoryId: categoryId,
        },
      });
    } else {
      console.log(`⚠️ Warning: Category "${item.catName}" ကို ရှာမတွေ့၍ "${item.name}" ကို ထည့်မရပါ`);
    }
  }

  console.log("✅ Menu Items အားလုံး ထည့်သွင်းပြီးပါပြီ။");

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

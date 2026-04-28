import { prisma } from "../libs/prisma";
import bcrypt from "bcrypt";

async function seed() {
  // ၁။ Admin User တစ်ယောက် အရင်ဆောက်မည်
  const user = await prisma.user.create({
    data: {
      name: "Harlan",
      email: "harlan@gmail.com",
      password: await bcrypt.hash("123456", 10),
      role: "ADMIN",
    },
  });
  console.log("Admin User created:", user.name);

  // ၂။ Opening Hours များ ထည့်သွင်းခြင်း
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  for (const day of days) {
    await prisma.hours.create({
      data: {
        dayOfWeek: day,
        shiftName: "Lunch",
        openTime: "12:00 PM",
        closeTime: "10:30 PM",
        isClosed: false,
      },
    });
  }
  console.log("Opening Hours created");

  // ၃။ Categories တစ်ခုချင်းစီ ဆောက်ပြီး Array ထဲ သိမ်းထားမည်
  const categoryNames = [
    { name: "Main Menu", slug: "main-menu", type: "FOOD" },
    { name: "Wine List", slug: "wine-list", type: "WINE" },
    { name: "Desserts", slug: "desserts", type: "FOOD" },
    { name: "Beverages", slug: "beverages", type: "FOOD" },
    { name: "Drinks", slug: "drinks", type: "FOOD" },
  ];

  const categories = [];
  for (const cat of categoryNames) {
    const createdCat = await prisma.category.create({ data: cat });
    categories.push(createdCat);
  }
  console.log("Categories created");

  // ၄။ Food Items များ ထည့်သွင်းခြင်း (categories[index]!.id ကို သုံးထားသည်)
  const foodItemsData = [
    {
      name: "Chicken Wings",
      description: "Chicken Wings",
      price: 10,
      image: "https://www.food.com/recipe/chicken-wings-100-recipes",
      isFeatured: true,
      isAvailable: true,
      categoryId: categories[0]!.id,
    },
    {
      name: "Chicken Tikka Masala",
      description: "Chicken Tikka Masala",
      price: 10,
      image: "https://www.food.com/recipe/chicken-tikka-masala-100-recipes",
      isFeatured: true,
      isAvailable: true,
      categoryId: categories[1]!.id,
    },
    {
      name: "Chicken Curry",
      description: "Chicken Curry",
      price: 10,
      image: "https://www.food.com/recipe/chicken-curry-100-recipes",
      isFeatured: true,
      isAvailable: true,
      categoryId: categories[2]!.id,
    },
    {
      name: "Chicken Biryani",
      description: "Chicken Biryani",
      price: 10,
      image: "https://www.food.com/recipe/chicken-biryani-100-recipes",
      isFeatured: true,
      isAvailable: true,
      categoryId: categories[3]!.id,
    },
    {
      name: "Chicken Kebab",
      description: "Chicken Kebab",
      price: 10,
      image: "https://www.food.com/recipe/chicken-kebab-100-recipes",
      isFeatured: true,
      isAvailable: true,
      categoryId: categories[4]!.id,
    },
  ];

  await prisma.foodItem.createMany({ data: foodItemsData });
  console.log("Food items created successfully!");

  // ၅။ Venue များ ထည့်သွင်းခြင်း
  console.log("Venues creating...");

  const venuesData = [
    {
      name: "The Terrace",
      slug: "the-terrace",
      description: "အပြင်ဘက်လေကောင်းလေသန့်ရရှိနိုင်ပြီး မြို့ပြအလှကို ခံစားနိုင်မည့်နေရာ။",
      capacity: 50,
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    },
    {
      name: "Private Room A",
      slug: "private-room-a",
      description: "မိသားစု သို့မဟုတ် စီးပွားရေးလုပ်ငန်းရှင်များ သီးသန့်ဆွေးနွေးတိုင်ပင်ရန် နေရာကောင်း။",
      capacity: 12,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    },
    {
      name: "Main Dining Hall",
      slug: "main-dining-hall",
      description: "ကျယ်ဝန်းလှပသော ခန်းမဆောင်ကြီးအတွင်း အရသာရှိသော အစားအစာများကို သုံးဆောင်နိုင်ပါသည်။",
      capacity: 100,
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    },
    {
      name: "The Cellar",
      slug: "the-cellar",
      description: "ဝိုင်အကောင်းစားများကို မြည်းစမ်းရင်း အေးအေးဆေးဆေး စကားပြောဆိုနိုင်မည့်နေရာ။",
      capacity: 20,
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
    },
  ];

  for (const venue of venuesData) {
    await prisma.venue.upsert({
      where: { slug: venue.slug },
      update: {}, // ရှိပြီးသားဆိုရင် ဘာမှမပြင်ဘူး
      create: venue, // မရှိသေးရင် အသစ်ဆောက်မယ်
    });
  }

  console.log("Venues created successfully!");

  console.log("Inquiries creating...");
  // အရင်ဆုံး Venue တစ်ခုခုရဲ့ ID ကို ယူမယ် (Relationship အတွက်)
  const venue = await prisma.venue.findFirst({ where: { slug: "the-terrace" } });

  const inquiriesData = [
    {
      type: "RESERVATION",
      name: "U Ba",
      email: "uba@gmail.com",
      phone: "09123456789",
      eventDate: new Date("2026-05-10T18:30:00Z"),
      guestCount: 4,
      message: "Window seat ရရင် ပိုကောင်းပါတယ်။",
      status: "CONFIRMED",
    },
    {
      type: "EVENT",
      name: "Daw Mya",
      email: "dawmya@outlook.com",
      phone: "09987654321",
      eventDate: new Date("2026-06-15T10:00:00Z"),
      guestCount: 30,
      message: "Birthday party ကျင်းပချင်လို့ပါ။ နေ့လည်စာ menu သိပါရစေ။",
      status: "PENDING",
      venueId: venue?.id, // The Terrace မှာ ပွဲလုပ်ဖို့ inquiry လုပ်ထားတဲ့ပုံစံ
    },
    {
      type: "RESERVATION",
      name: "Harlan Fan",
      email: "fan@harlan.com",
      phone: "09444555666",
      eventDate: new Date("2026-05-12T19:00:00Z"),
      guestCount: 2,
      message: "Anniversary အတွက်ပါ။",
      status: "PENDING",
    },
    {
      type: "EVENT",
      name: "Tech Company Ltd.",
      email: "hr@techco.com",
      phone: "09777888999",
      eventDate: new Date("2026-07-01T17:00:00Z"),
      guestCount: 45,
      message: "Company Dinner လုပ်ဖို့အတွက်ပါ။",
      status: "CANCELLED",
    },
  ];

  for (const inquiry of inquiriesData) {
    await prisma.inquiry.create({
      data: inquiry,
    });
  }
  console.log("Inquiries created successfully!");

  console.log("Gallery images creating...");
  const galleryData = [
    // INTERIOR (ဆိုင်အပြင်အဆင်)
    {
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      category: "INTERIOR",
      caption: "Harlan ရဲ့ ခေတ်မီပြီး ဆိတ်ငြိမ်လှပသော ဆိုင်အတွင်းပိုင်း အပြင်အဆင်။",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
      category: "INTERIOR",
      caption: "နွေးထွေးသော အလင်းရောင်နှင့်အတူ အကောင်းဆုံး Dining Experience။",
    },
    // CUISINE (အစားအသောက်)
    {
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      category: "CUISINE",
      caption: "ကျွန်ုပ်တို့၏ Signature Steak - အရသာနှင့် အနံ့ပြည့်စုံသော ဟင်းလျာ။",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307",
      category: "CUISINE",
      caption: "လတ်ဆတ်သော ပါဝင်ပစ္စည်းများဖြင့် ဖန်တီးထားသည့် အချိုပွဲများ။",
    },
    // EVENTS (ပွဲလမ်းသဘင်များ)
    {
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
      category: "EVENTS",
      caption: "Harlan မှာ ကျင်းပခဲ့သော ပျော်ရွှင်စရာ Birthday Party အမှတ်တရ။",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
      category: "EVENTS",
      caption: "Private Room A တွင် ကျင်းပသည့် စီးပွားရေးလုပ်ငန်းရှင်များ၏ ညစာစားပွဲ။",
    },
  ];

  for (const item of galleryData) {
    await prisma.gallery.create({
      data: item,
    });
  }
  console.log("Gallery created successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

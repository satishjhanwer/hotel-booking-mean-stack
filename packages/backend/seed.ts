import { config } from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";
import Hotel from "./models/Hotel";
import User from "./models/User";

config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const hotels = [
  {
    name: "Harborview Hotel",
    address: "18 Bay Street",
    zip: "94105",
    city: "San Francisco",
    state: "California",
    rate: 189,
    roomCount: 24,
    roomTypes: [
      { type: "Queen", price: 189 },
      { type: "King", price: 229 },
    ],
    reviews: [],
  },
  {
    name: "Central Park Inn",
    address: "42 West 58th Street",
    zip: "10019",
    city: "New York",
    state: "New York",
    rate: 245,
    roomCount: 18,
    roomTypes: [
      { type: "Double", price: 245 },
      { type: "Suite", price: 340 },
    ],
    reviews: [],
  },
  {
    name: "Desert Bloom Resort",
    address: "700 Palm Canyon Drive",
    zip: "92262",
    city: "Palm Springs",
    state: "California",
    rate: 165,
    roomCount: 32,
    roomTypes: [
      { type: "King", price: 165 },
      { type: "Poolside Suite", price: 275 },
    ],
    reviews: [],
  },
  {
    name: "Lakeside Lodge",
    address: "9 Shoreline Road",
    zip: "60601",
    city: "Chicago",
    state: "Illinois",
    rate: 155,
    roomCount: 21,
    roomTypes: [
      { type: "Queen", price: 155 },
      { type: "Lake View King", price: 215 },
    ],
    reviews: [],
  },
];

async function seedUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  isAdmin: boolean,
) {
  const user = new User({ email, firstName, lastName, isAdmin });
  user.password = user.generateHash(password);
  const result = await User.updateOne(
    { email },
    { $setOnInsert: user.toObject() },
    { upsert: true },
  );
  return result.upsertedCount > 0;
}

async function seed() {
  const mongoUri = process.env.DB_URI;
  if (!mongoUri)
    throw new Error(
      "DB_URI is missing. Set it in packages/backend/.env before running the seed command.",
    );
  await mongoose.connect(mongoUri);

  let insertedHotels = 0;
  for (const hotel of hotels) {
    const result = await Hotel.updateOne(
      { name: hotel.name, city: hotel.city },
      { $setOnInsert: hotel },
      { upsert: true },
    );
    insertedHotels += result.upsertedCount;
  }

  const adminInserted = await seedUser(
    process.env.SEED_ADMIN_EMAIL ?? "admin@hotelbooking.com",
    process.env.SEED_ADMIN_PASSWORD ?? "HotelAdmin123!",
    "Local",
    "Admin",
    true,
  );
  const guestInserted = await seedUser(
    process.env.SEED_GUEST_EMAIL ?? "guest@hotelbooking.com",
    process.env.SEED_GUEST_PASSWORD ?? "Guest123!",
    "Demo",
    "Guest",
    false,
  );

  console.log(
    "Seed complete: " +
      insertedHotels +
      " hotel(s), " +
      (Number(adminInserted) + Number(guestInserted)) +
      " user(s) added. Existing seed records were left unchanged.",
  );
  console.log(
    "Local admin: admin@hotelbooking.com / HotelAdmin123! (override with SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD)",
  );
  console.log(
    "Local guest: guest@hotelbooking.com / Guest123! (override with SEED_GUEST_EMAIL and SEED_GUEST_PASSWORD)",
  );
}

seed()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

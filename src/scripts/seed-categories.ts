import { db } from "@/db";
import { categories } from "@/db/schema/categories.schema";

const categoryNames = [
  "Fruits",
  "Vegetables",
  "Meat",
  "Fish",
  "Dairy",
  "Bakery",
  "Drinks",
  "Frozen",
  "Canned",
  "Sweets",
  "Snacks",
  "Household",
  "Personal Care",
  "Pet Care",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `All ${name.toLowerCase()} products`,
    }));

    await db.insert(categories).values(values);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

main();

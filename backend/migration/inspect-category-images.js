// READ-ONLY. Lists every category's name, slug, and image.url so we can see
// which ones have broken/missing images. Writes nothing to the database.
//
//   node migration/inspect-category-images.js

import "dotenv/config";
import { connectMongo, disconnectMongo } from "./db/mongo.js";
import Category from "../src/models/Category.js";

async function main() {
  await connectMongo();

  const categories = await Category.find({})
    .select("name slug image isActive")
    .sort({ name: 1 })
    .lean();

  console.log(`\n=== ${categories.length} categories ===\n`);

  for (const c of categories) {
    const url = c.image?.url || "(none)";
    const publicId = c.image?.public_id || "(none)";
    const flag = !c.image?.url ? " <-- NO IMAGE" : "";
    console.log(`${c.name} [${c.slug}]`);
    console.log(`  url: ${url}${flag}`);
    console.log(`  public_id: ${publicId}`);
    console.log(`  isActive: ${c.isActive}`);
    console.log("");
  }

  await disconnectMongo();
}

main().catch((err) => {
  console.error("[inspect-category-images] Failed:", err);
  process.exitCode = 1;
});

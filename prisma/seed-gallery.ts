import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGallery() {
  const defaultImages = [
    {
      position: 1,
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
      filename: "default-1.jpg"
    },
    {
      position: 2,
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
      filename: "default-2.jpg"
    },
    {
      position: 3,
      url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop",
      filename: "default-3.jpg"
    },
    {
      position: 4,
      url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop",
      filename: "default-4.jpg"
    }
  ];

  for (const image of defaultImages) {
    await prisma.galleryImage.upsert({
      where: { position: image.position },
      update: image,
      create: image
    });
  }

  console.log('Gallery seeded with default images');
}

seedGallery()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
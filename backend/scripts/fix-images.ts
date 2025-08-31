import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixInvalidImageUrls() {
  try {
    // Find invalid image URLs (via.placeholder.com and broken URLs)
    const invalidImages = await prisma.image.findMany({
      where: {
        OR: [
          { url: { contains: 'via.placeholder.com' } },
          { url: { contains: 'placeholder.com' } },
          { url: { equals: '' } },
        ],
      },
    });

    console.log(`Found ${invalidImages.length} invalid images`);

    // Delete invalid images
    if (invalidImages.length > 0) {
      const deleteResult = await prisma.image.deleteMany({
        where: {
          id: { in: invalidImages.map((img) => img.id) },
        },
      });
      console.log(`Deleted ${deleteResult.count} invalid images`);
    }

    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Error fixing images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixInvalidImageUrls();

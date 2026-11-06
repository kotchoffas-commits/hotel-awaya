import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  await prisma.room.createMany({
    data: [
      {
        slug: 'chambre-standard',
        nameFr: 'Chambre Standard',
        nameEn: 'Standard Room',
        descFr: 'Confort et simplicite. Lit double, salle de bain privative, Wi-Fi inclus.',
        descEn: 'Comfort and simplicity. Double bed, private bathroom, Wi-Fi included.',
        capacity: 2,
        sizeSqm: 18,
        basePrice: 85,
        images: JSON.stringify(['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80']),
        amenities: JSON.stringify(['wifi', 'tv', 'ac']),
        published: true,
      },
      {
        slug: 'chambre-twin',
        nameFr: 'Chambre Twin',
        nameEn: 'Twin Room',
        descFr: 'Deux lits simples, ideale pour les amis ou collegues en deplacement.',
        descEn: 'Two single beds, ideal for friends or colleagues travelling together.',
        capacity: 2,
        sizeSqm: 22,
        basePrice: 95,
        images: JSON.stringify(['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80']),
        amenities: JSON.stringify(['wifi', 'tv', 'ac', 'desk']),
        published: true,
      },
      {
        slug: 'chambre-deluxe',
        nameFr: 'Chambre Deluxe',
        nameEn: 'Deluxe Room',
        descFr: 'Spacieuse et lumineuse, avec vue sur la colline.',
        descEn: 'Spacious and bright, with a view of the hill.',
        capacity: 2,
        sizeSqm: 25,
        basePrice: 120,
        images: JSON.stringify(['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80']),
        amenities: JSON.stringify(['wifi', 'tv', 'ac', 'minibar', 'safe']),
        published: true,
      },
      {
        slug: 'suite-junior',
        nameFr: 'Suite Junior',
        nameEn: 'Junior Suite',
        descFr: 'Un espace elegant avec salon separe. Lit king-size, baignoire.',
        descEn: 'An elegant space with a separate living room. King-size bed, bathtub.',
        capacity: 3,
        sizeSqm: 40,
        basePrice: 180,
        images: JSON.stringify(['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80']),
        amenities: JSON.stringify(['wifi', 'tv', 'ac', 'minibar', 'safe', 'bathtub', 'balcony']),
        published: true,
      },
      {
        slug: 'chambre-familiale',
        nameFr: 'Chambre Familiale',
        nameEn: 'Family Room',
        descFr: 'Ideale pour les familles, jusqu a 4 personnes. Deux lits doubles.',
        descEn: 'Ideal for families, up to 4 guests. Two double beds.',
        capacity: 4,
        sizeSqm: 35,
        basePrice: 220,
        images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80']),
        amenities: JSON.stringify(['wifi', 'tv', 'ac', 'safe', 'crib']),
        published: true,
      },
      {
        slug: 'suite-panoramique',
        nameFr: 'Suite Panoramique',
        nameEn: 'Panoramic Suite',
        descFr: 'Notre suite la plus prestigieuse. Terrasse privee, vue a 180 degres.',
        descEn: 'Our most prestigious suite. Private terrace, 180 degree view.',
        capacity: 2,
        sizeSqm: 55,
        basePrice: 320,
        images: JSON.stringify(['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80']),
        amenities: JSON.stringify(['wifi', 'tv', 'ac', 'minibar', 'safe', 'bathtub', 'jacuzzi', 'terrace', 'room-service']),
        published: true,
      },
    ],
  });

  const count = await prisma.room.count();
  console.log('OK : ' + count + ' chambres creees avec succes.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
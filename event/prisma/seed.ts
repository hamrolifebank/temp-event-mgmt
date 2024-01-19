import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const organisation = await prisma.organization.upsert({
    where: { name: 'marius' },
    update: {},
    create: {
      name: 'marius',
      email: 'marius@gmail.com',
      phone: '9843866516',
      address: 'jhamsikhel',
      isBloodBank: true,
    },
  });

  console.log({ organisation });
  const date = '2024-03-10';
  const start = '08:30:00';
  const end = '11:30:00';
  const event = await prisma.event.create({
    data: {
      name: 'Third Event',
      contactPhone: '9813642930',
      contactEmail: 'third@gmail.com',
      location: 'Chobar',
      latitude: 27.736893,
      longitude: 85.354894,
      bloodBank: 'Rumsan',
      target: 44,
      date: new Date(date),
      startTime: new Date(`${date}T${start}`),
      endTime: new Date(`${date}T${end}`),
      isClosed: false,
    },
  });
  console.log({ event });

  const pledger = await prisma.donor.create({
    data: {
      name: 'Arju Pasang',
      phone: '9803645450',
      email: 'arju12@gmail.com',
      dop: new Date('1994-02-24'),
      dopNp: new Date('2051/02/14'),
      gender: 'F',
      bloodGroup: 'B_POSITIVE',
      location: 'lalitpur',
      eventId: event.uuid,
    },
  });
  console.log({ pledger });
  const donation = await prisma.donation.upsert({
    where: { bloodBagId: '9879' },
    update: {},
    create: {
      bloodBagType: 'SINGLE',
      bloodBagId: '9879',
      tubeId: '122',
      consentUrl: '/Users/surendra/Desktop/consent.jpeg',
      rejectReason: { medicine_user: true, low_pressure: true, hb_low: true },
      donorId: pledger.uuid,
      eventId: event.uuid,
    },
  });
  console.log(donation);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

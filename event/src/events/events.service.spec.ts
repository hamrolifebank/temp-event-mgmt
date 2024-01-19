import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonorDto } from '../donors/dto/create-donor.dto';
import { CreateDonationDto } from '../donations/dto/create-donation.dto';
import { Any } from 'typeorm';

describe('EventsService', () => {
  let service: EventsService;
  let prismaService: PrismaService;
  const firstDate = '2024-03-10';
  const secondDate = '2024-04-19';
  const startTime = '08:30:00';
  const endTime = '11:30:00';

  const events = [
    {
      id: 1,
      uuid: '0ea7039b-20b5-49b3-aadf-02c081c4a7e1',
      name: 'first',
      contactPhone: '9813642931',
      contactEmail: 'first@gmail.com',
      location: 'puranoBanehwor',
      latitude: 27.736833,
      longitude: 85.354864,
      bloodBank: 'Rumsan',
      target: 30,
      date: new Date(firstDate),
      startTime: new Date(`${firstDate}T${startTime}`),
      endTime: new Date(`${firstDate}T${endTime}`),
      isClosed: false,
    },
    {
      id: 2,
      uuid: '4dd88657-eaf6-4357-b3f5-ec674d97b1a4',
      name: 'Second',
      contactPhone: '9813642931',
      contactEmail: 'second@gmail.com',
      location: 'nayaBanehwor',
      latitude: 27.736893,
      longitude: 85.354894,
      bloodBank: 'Rumsan',
      target: 30,
      date: new Date(secondDate),
      startTime: new Date(`${secondDate}T${startTime}`),
      endTime: new Date(`${secondDate}T${endTime}`),
      isClosed: false,
    },
  ];

  const mockPrismaService = {
    event: {
      findMany: jest.fn(() => events),
      create: jest.fn((data) => {
        return {
          ...data.data,
          id: 3,
          uuid: '6c239446-4031-4c64-80fc-26a5386cf138',
        };
      }),
      findUnique: jest.fn((params) => {
        if (params.where.uuid === '4dd88657-eaf6-4357-b3f5-ec674d97b1a4') {
          return events[1];
        }
        return null;
      }),
      update: jest.fn((params) => {
        if (params.where.uuid === '4dd88657-eaf6-4357-b3f5-ec674d97b1a4') {
          const index = events.findIndex(
            (org) => org.uuid === '4dd88657-eaf6-4357-b3f5-ec674d97b1a4',
          );
          events[index] = {
            id: 2,
            uuid: '4dd88657-eaf6-4357-b3f5-ec674d97b1a4',
            ...params.data,
          };

          return events[index];
        }
      }),
      delete: jest.fn((params) => {
        const deletedIndex = events.findIndex(
          (org) => org.uuid === params.where.uuid,
        );

        if (deletedIndex !== -1) {
          // If the organization is found, remove it from the array and return it
          const deletedOrganization = events.splice(deletedIndex, 1)[0];
          return deletedOrganization;
        }

        // If the organization is not found, return null
        return null;
      }),
    },
    donor: {
      create: jest.fn((data) => {
        return {
          ...data.data,
          id: 3,
          uuid: '957d5737-c34e-41e2-ab4a-1ff1ef3a892e',
          latitude: null,
          longitude: null,
          lastDonated: null,
        };
      }),
    },
    donation: {
      create: jest.fn((data) => {
        return {
          ...data.data,
          id: 3,
          uuid: '957d5737-c34e-41e2-ab4a-1ff1ef3a892e',
          note: null,
          custom: null,
        };
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create event', async () => {
    const createDto = {
      name: 'Third Event',
      contactPhone: '9813642930',
      contactEmail: 'third@gmail.com',
      location: 'Chobar',
      latitude: 27.736893,
      longitude: 85.354894,
      bloodBank: 'Rumsan',
      target: 44,
      date: '2024-03-10',
      startTime: '08:30:00',
      endTime: '11:30:00',
      isClosed: false,
    };
    const expectedResult = {
      id: 3,
      uuid: '6c239446-4031-4c64-80fc-26a5386cf138',
      name: 'Third Event',
      contactPhone: '9813642930',
      contactEmail: 'third@gmail.com',
      location: 'Chobar',
      latitude: 27.736893,
      longitude: 85.354894,
      bloodBank: 'Rumsan',
      target: 44,
      isClosed: false,
      organizationId: undefined,
      date: new Date(createDto.date), // Convert date to string
      startTime: new Date(`${createDto.date}T${createDto.startTime}`), // Convert time to string
      endTime: new Date(`${createDto.date}T${createDto.endTime}`),
    };

    const result = await service.create(createDto);

    jest
      .spyOn(mockPrismaService.event, 'create')
      .mockReturnValue(expectedResult);

    expect(mockPrismaService.event.create).toHaveBeenCalledWith({
      data: {
        ...createDto,
        date: new Date(createDto.date),
        startTime: new Date(`${createDto.date}T${createDto.startTime}`),
        endTime: new Date(`${createDto.date}T${createDto.endTime}`),
      },
    });

    expect(result).toEqual(expectedResult);
  });
  it('should return list of the organizations', async () => {
    const result = await service.findAll();
    expect(result).toEqual(events);
    jest.spyOn(mockPrismaService.event, 'findMany').mockReturnValue(events);
  });

  it('It should return requested event by uuid', async () => {
    const orgUUID = '4dd88657-eaf6-4357-b3f5-ec674d97b1a4';
    const result = await service.findOne(orgUUID);
    expect(result).toEqual(events[1]);
    expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({
      where: { uuid: orgUUID },
    });
  });

  it('It should update event', async () => {
    const orgUUID = '4dd88657-eaf6-4357-b3f5-ec674d97b1a4';
    const updateEvent = {
      name: 'Second',
      contactPhone: '9813642900',
      contactEmail: 'second@gmail.com',
      location: 'Balaju',
      latitude: 27.736893,
      longitude: 85.354894,
      bloodBank: 'Rumsan',
      target: 55,
      date: '2024-01-31',
      startTime: '07:00:00',
      endTime: '08:00:00',
      isClosed: false,
    };

    const result = await service.update(orgUUID, updateEvent);

    expect(result).toEqual({
      id: 2,
      uuid: '4dd88657-eaf6-4357-b3f5-ec674d97b1a4',
      name: 'Second',
      contactPhone: '9813642900',
      contactEmail: 'second@gmail.com',
      location: 'Balaju',
      latitude: 27.736893,
      longitude: 85.354894,
      bloodBank: 'Rumsan',
      target: 55,
      date: new Date(updateEvent.date),
      startTime: new Date(`${updateEvent.date}T${updateEvent.startTime}`),
      endTime: new Date(`${updateEvent.date}T${updateEvent.endTime}`),
      isClosed: false,
    });
    expect(mockPrismaService.event.update).toHaveBeenCalledWith({
      where: { uuid: orgUUID },
      data: {
        ...updateEvent,
        date: new Date(updateEvent.date),
        startTime: new Date(`${updateEvent.date}T${updateEvent.startTime}`),
        endTime: new Date(`${updateEvent.date}T${updateEvent.endTime}`),
      },
    });
  });
  it('it should add pledger to the requested event', async () => {
    const eventUUID = '0ea7039b-20b5-49b3-aadf-02c081c4a7e1';
    const createDonorDto: CreateDonorDto = {
      name: 'Arju Pasang',
      phone: '9803645450',
      email: 'arju12@gmail.com',
      dop: '1994-02-24',
      dopNp: '2051/02/14',
      gender: 'F',
      bloodGroup: 'B_POSITIVE',
      location: 'lalitpur',
    };
    const expectedResult = {
      id: 3,
      uuid: '957d5737-c34e-41e2-ab4a-1ff1ef3a892e',
      name: 'Arju Pasang',
      phone: '9803645450',
      email: 'arju12@gmail.com',
      dop: new Date(createDonorDto.dop),
      dopNp: new Date(createDonorDto.dopNp),
      gender: 'F',
      bloodGroup: 'B_POSITIVE',
      location: 'lalitpur',
      latitude: null,
      longitude: null,
      lastDonated: null,
      eventId: eventUUID,
    };
    const result = await service.createPledgerForEvent(
      createDonorDto,
      eventUUID,
    );

    expect(result).toEqual(expectedResult);
    expect(mockPrismaService.donor.create).toHaveBeenCalledWith({
      data: {
        ...createDonorDto,
        dop: new Date(createDonorDto.dop),
        dopNp: new Date(createDonorDto.dopNp),
        eventId: eventUUID,
      },
    });
  });

  it('it should add donation to the requested event', async () => {
    const eventUUID = '0ea7039b-20b5-49b3-aadf-02c081c4a7e1';
    const createDonationDto: CreateDonationDto = {
      bloodBagType: 'SINGLE',
      bloodBagId: '9879',
      tubeId: '122',
      consentUrl: '/Users/surendra/Desktop/consent.jpeg',
      rejectReason: { medicine_user: true, low_pressure: true, hb_low: true },
      donorId: '74d930ee-93f9-4ac5-91cf-e0d0c571886a',
    };
    const expectedResult = {
      id: 3,
      uuid: '957d5737-c34e-41e2-ab4a-1ff1ef3a892e',
      bloodBagType: 'SINGLE',
      bloodBagId: '9879',
      tubeId: '122',
      note: null,
      custom: null,
      consentUrl: '/Users/surendra/Desktop/consent.jpeg',
      rejectReason: { medicine_user: true, low_pressure: true, hb_low: true },
      donorId: '74d930ee-93f9-4ac5-91cf-e0d0c571886a',
      eventId: eventUUID,
    };
    const result = await service.createDonorForEvent(
      createDonationDto,
      eventUUID,
    );

    expect(result).toEqual(expectedResult);
    expect(mockPrismaService.donation.create).toHaveBeenCalledWith({
      data: {
        ...createDonationDto,
        eventId: eventUUID,
      },
    });
  });
});

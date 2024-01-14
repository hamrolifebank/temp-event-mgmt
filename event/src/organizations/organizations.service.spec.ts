import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';

import { PrismaService } from '../prisma/prisma.service';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let prismaService: PrismaService;

  const organisations = [
    {
      id: 1,
      uuid: '0ea7039b-20b5-49b3-aadf-02c081c4a7e1',
      name: 'Org-1',
      email: 'org1@example.com',
      phone: '1234567890',
      address: 'Address 1',
      isBloodBank: true,
    },
    {
      id: 2,
      uuid: '4dd88657-eaf6-4357-b3f5-ec674d97b1a4',
      name: 'Org-2',
      email: 'org2@example.com',
      phone: '9876543210',
      address: 'Address 2',
      isBloodBank: false,
    },
  ];

  const mockPrismaService = {
    organization: {
      findMany: jest.fn(() => organisations),
      create: jest.fn((data) => data),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,

        {
          provide: PrismaService,

          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all the list of organization', async () => {
    const result = await service.findAll();
    expect(result).toEqual(organisations);
    jest
      .spyOn(mockPrismaService.organization, 'findMany')
      .mockReturnValue(organisations);
  });

  it('create organisation', async () => {
    const createDto = {
      name: 'marius',
      email: 'marius@gmail.com',
      phone: '9843866516',
      address: 'jhamsikhel',
      isBloodBank: true,
    };
    const expectedResult = {
      ...createDto,
      id: 3,
      uuid: '6c239446-4031-4c64-80fc-26a5386cf138',
    };
    jest
      .spyOn(mockPrismaService.organization, 'create')
      .mockReturnValue(expectedResult);
    const result = await service.create(createDto);

    expect(mockPrismaService.organization.create).toHaveBeenCalledWith({
      data: createDto,
    });
    expect(result).toEqual(expectedResult);
  });
});

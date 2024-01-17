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
      findUnique: jest.fn((params) => {
        if (params.where.uuid === '4dd88657-eaf6-4357-b3f5-ec674d97b1a4') {
          return organisations[1];
        }
        return null;
      }),
      update: jest.fn((params) => {
        if (params.where.uuid === '4dd88657-eaf6-4357-b3f5-ec674d97b1a4') {
          const index = organisations.findIndex(
            (org) => org.uuid === '4dd88657-eaf6-4357-b3f5-ec674d97b1a4',
          );
          organisations[index] = {
            id: 2,
            uuid: '4dd88657-eaf6-4357-b3f5-ec674d97b1a4',
            ...params.data,
          };
          return organisations[index];
        }
      }),
      delete: jest.fn((params) => {
        const deletedIndex = organisations.findIndex(
          (org) => org.uuid === params.where.uuid,
        );

        if (deletedIndex !== -1) {
          // If the organization is found, remove it from the array and return it
          const deletedOrganization = organisations.splice(deletedIndex, 1)[0];
          return deletedOrganization;
        }

        // If the organization is not found, return null
        return null;
      }),
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

  it('It should return requested organization by uuid', async () => {
    const orgUUID = '4dd88657-eaf6-4357-b3f5-ec674d97b1a4';
    const result = await service.findOne(orgUUID);
    expect(result).toEqual(organisations[1]);
    expect(mockPrismaService.organization.findUnique).toHaveBeenCalledWith({
      where: { uuid: orgUUID },
      include: {
        events: true,
      },
    });
  });

  it('It should update organization', async () => {
    const orgUUID = '4dd88657-eaf6-4357-b3f5-ec674d97b1a4';
    const updateOrganization = {
      name: 'Org-2',
      email: 'org2@example.com',
      phone: '9876543200',
      address: 'kapan',
      isBloodBank: false,
    };
    const result = await service.update(orgUUID, updateOrganization);

    expect(result).toEqual({
      id: 2,
      uuid: '4dd88657-eaf6-4357-b3f5-ec674d97b1a4',
      name: 'Org-2',
      email: 'org2@example.com',
      phone: '9876543200',
      address: 'kapan',
      isBloodBank: false,
    });
    expect(mockPrismaService.organization.update).toHaveBeenCalledWith({
      where: { uuid: orgUUID },
      data: updateOrganization,
    });
  });

  it('It should delete the organization', async () => {
    const orgUUID = '0ea7039b-20b5-49b3-aadf-02c081c4a7e1';
    const result = await service.remove(orgUUID);

    expect(result).toEqual({
      id: 1,
      uuid: '0ea7039b-20b5-49b3-aadf-02c081c4a7e1',
      name: 'Org-1',
      email: 'org1@example.com',
      phone: '1234567890',
      address: 'Address 1',
      isBloodBank: true,
    });
    expect(organisations).toHaveLength(1);
    expect(organisations.find((org) => org.uuid === orgUUID)).toBeUndefined();
  });
});

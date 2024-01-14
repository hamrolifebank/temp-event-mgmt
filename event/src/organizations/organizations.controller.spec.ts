import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  const mockOrganizationService = {
    create: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return [];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [OrganizationsService],
    })
      .overrideProvider(OrganizationsService)
      .useValue(mockOrganizationService)
      .compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a new organization', () => {
    const dto = {
      name: 'marius',
      email: 'marius@gmail.com',
      phone: '9843866516',
      address: 'jhamsikhel',
      isBloodBank: true,
    };
    expect(controller.create(dto)).toEqual(dto);
    expect(mockOrganizationService.create).toHaveBeenCalledWith(dto);
  });
  it('should get all the organizations', () => {
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
    mockOrganizationService.findAll.mockReturnValue(organisations);
    const result = controller.findAll();
    expect(result).toEqual(organisations);
  });
});

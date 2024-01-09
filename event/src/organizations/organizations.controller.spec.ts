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
    expect(
      controller.create({
        name: 'marius',
        email: 'marius@gmail.com',
        phone: '9843866516',
        address: 'jhamsikhel',
        isBloodBank: true,
      }),
    ).toEqual({
      name: 'marius',
      email: 'marius@gmail.com',
      phone: '9843866516',
      address: 'jhamsikhel',
      isBloodBank: true,
    });
  });
});

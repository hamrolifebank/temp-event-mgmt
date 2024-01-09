import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
//import { PrismaService } from 'src/prisma/prisma.service';
//import { CreateOrganizationDto } from './dto/create-organization.dto';
//import { UpdateOrganizationDto } from './dto/update-organization.dto';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  //let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationsService],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}
  create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: createOrganizationDto });
  }

  findAll() {
    return this.prisma.organization.findMany();
  }

  findOne(uuid: string) {
    return this.prisma.organization.findUnique({
      where: { uuid },
    });
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}

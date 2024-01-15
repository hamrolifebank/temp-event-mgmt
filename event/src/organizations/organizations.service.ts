import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from '../prisma/prisma.service';

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
      include: {
        events: true,
      },
    });
  }

  update(uuid: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { uuid },
      data: updateOrganizationDto,
    });
  }

  remove(uuid: string) {
    return this.prisma.organization.delete({
      where: { uuid },
    });
  }
}

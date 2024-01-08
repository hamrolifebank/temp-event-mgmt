import { Injectable } from '@nestjs/common';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DonorsService {
  constructor(private prisma: PrismaService) {}
  create(createDonorDto: CreateDonorDto) {
    return 'This action adds a new donor';
  }

  findAll() {
    return this.prisma.donor.findMany();
  }

  findOne(uuid: string) {
    return this.prisma.donor.findUnique({
      where: { uuid: uuid },
    });
  }

  update(id: number, updateDonorDto: UpdateDonorDto) {
    return `This action updates a #${id} donor`;
  }

  remove(id: number) {
    return `This action removes a #${id} donor`;
  }
}

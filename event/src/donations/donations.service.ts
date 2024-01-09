import { Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}
  create(createDonationDto: CreateDonationDto) {
    return this.prisma.donation.create({ data: createDonationDto });
  }

  findAll() {
    return this.prisma.donation.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} donation`;
  }

  update(uuid: string, updateDonationDto: UpdateDonationDto) {
    console.log(updateDonationDto, 'from update service');
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}

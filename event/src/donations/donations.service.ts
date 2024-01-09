import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(uuid: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { uuid },
    });
    if (!donation) {
      throw new NotFoundException(`Donation with ${uuid} does not exist`);
    }
    return donation;
  }

  update(uuid: string, updateDonationDto: UpdateDonationDto) {
    console.log(updateDonationDto, 'from update service');
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}

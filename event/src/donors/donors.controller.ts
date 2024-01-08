import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Post()
  create(@Body() createDonorDto: any) {
    console.log(createDonorDto);
    return this.donorsService.create(createDonorDto);
  }

  @Get()
  findAll() {
    return this.donorsService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    const donor = await this.donorsService.findOne(uuid);

    if (!donor) {
      throw new NotFoundException(`Donor with ${uuid} does not exist`);
    }
    return donor;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonorDto: UpdateDonorDto) {
    return this.donorsService.update(+id, updateDonorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donorsService.remove(+id);
  }
}

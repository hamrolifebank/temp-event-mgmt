import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateDonorDto } from 'src/donors/dto/create-donor.dto';
import { CreateDonationDto } from 'src/donations/dto/create-donation.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }
  @Get(':uuid/pledgers')
  getPledgerForEvent(@Param('uuid') uuid: string) {
    return this.eventsService.getPledgerForEvent(uuid);
  }

  @Get(':uuid/donors')
  getDonorForEvent(@Param('uuid') uuid: string) {
    return this.eventsService.getPledgerForEvent(uuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.eventsService.findOne(uuid);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(uuid, updateEventDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.eventsService.remove(uuid);
  }

  @Post(':uuid/pledgers')
  createPledgerForEvent(
    @Param('uuid') uuid: string,
    @Body() createDonorDto: CreateDonorDto, // Use the DTO for creating a pledger
  ) {
    return this.eventsService.createPledgerForEvent(createDonorDto, uuid);
  }

  @Post(':uuid/donors')
  createDonorForEvent(
    @Param('uuid') uuid: string,
    @Body() createDonationDto: CreateDonationDto,
  ) {
    return this.eventsService.createDonorForEvent(createDonationDto, uuid);
  }
}

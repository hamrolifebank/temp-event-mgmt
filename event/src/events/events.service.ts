import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}
  create(createEventDto: CreateEventDto) {
    const {
      name,
      contactPhone,
      contactEmail,
      location,
      latitude,
      longitude,
      target,
      isClosed,
      bloodBank,
      organizationId,
      date,
      startTime,
      endTime,
    } = createEventDto;

    const dateOfEvent = new Date(date);

    const startTimeObj = new Date(`${date}T${startTime}`);

    const endTimeObj = new Date(`${date}T${endTime}`);

    return this.prisma.event.create({
      data: {
        name,
        contactPhone,
        contactEmail,
        location,
        latitude,
        longitude,
        target,
        isClosed,
        organizationId,
        date: dateOfEvent,
        bloodBank,
        startTime: startTimeObj,
        endTime: endTimeObj,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  findOne(uuid: string) {
    return this.prisma.event.findUnique({
      where: { uuid },
    });
  }

  update(uuid: string, updateEventDto: UpdateEventDto) {
    const { date, startTime, endTime, contactEmail } = updateEventDto;

    // return this.prisma.event.update({
    //   where: {
    //     uuid,
    //   },
    //   data: updateEventDto,
    // });
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}

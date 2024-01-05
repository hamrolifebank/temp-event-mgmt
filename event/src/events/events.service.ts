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

  async update(uuid: string, updateEventDto: UpdateEventDto) {
    const { date, startTime, endTime } = updateEventDto;

    if (date && startTime && endTime) {
      const newDate = new Date(date);
      const start = new Date(`${date}T${startTime}`);

      const end = new Date(`${date}T${endTime}`);

      return this.prisma.event.update({
        where: { uuid },
        data: {
          date: newDate,
          startTime: start,
          endTime: end,
        },
      });
    } else if (startTime || endTime) {
      const findEvent = await this.prisma.event.findUnique({
        where: { uuid },
      });
      const year = String(findEvent.date.getFullYear());

      const month = String(findEvent.date.getMonth() + 1).padStart(2, '0');

      const day = String(findEvent.date.getDate()).padStart(2, '0');

      const newDate = `${year}-${month}-${day}`;

      let start: Date;
      let end: Date;
      if (startTime) {
        start = new Date(`${newDate}T${startTime}`);
      }
      if (endTime) {
        end = new Date(`${newDate}T${endTime}`);
      }
      return this.prisma.event.update({
        where: { uuid },
        data: {
          startTime: start,
          endTime: end,
        },
      });
    } else {
      return this.prisma.event.update({
        where: {
          uuid,
        },
        data: updateEventDto,
      });
    }
  }

  remove(uuid: string) {
    return this.prisma.event.delete({
      where: { uuid },
    });
  }
}

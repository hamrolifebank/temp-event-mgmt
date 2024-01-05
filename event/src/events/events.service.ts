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
    } = createEventDto;
    const [year, month, day] = date.split(',').map(Number);
    const adjustedMonth = month - 1;

    const [hours, minutes, seconds] = createEventDto.startTime
      .split(':')
      .map(Number);

    const [endHours, endMinutes, endSeconds] = createEventDto.endTime
      .split(':')
      .map(Number);

    const startTime = new Date(
      year,
      adjustedMonth,
      day,
      hours,
      minutes,
      seconds,
      0,
    );

    const endTime = new Date(
      year,
      adjustedMonth,
      day,
      endHours,
      endMinutes,
      endSeconds,
      0,
    );

    const dateOfEvent = new Date(date);

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
        startTime,
        endTime,
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

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}

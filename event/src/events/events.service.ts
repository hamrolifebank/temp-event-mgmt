import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonorDto } from 'src/donors/dto/create-donor.dto';
import { CreateDonationDto } from 'src/donations/dto/create-donation.dto';

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

  getPledgerForEvent(uuid: string) {
    return this.prisma.event.findUnique({
      where: { uuid: uuid },
      include: { donors: true },
    });
  }

  getDonorForEvent(uuid: string) {
    return this.prisma.event.findUnique({
      where: { uuid: uuid },
      include: { donations: true },
    });
  }

  async update(uuid: string, updateEventDto: UpdateEventDto) {
    const findEvent = await this.prisma.event.findUnique({
      where: { uuid },
    });

    const {
      date,
      startTime,
      endTime,
      name,
      contactPhone,
      contactEmail,
      location,
      latitude,
      longitude,
      bloodBank,
      target,
      isClosed,
    } = updateEventDto;

    const currentYear = String(findEvent.date.getFullYear());
    const currentMonth = String(findEvent.date.getMonth() + 1).padStart(2, '0');
    const currentDay = String(findEvent.date.getDate()).padStart(2, '0');
    const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

    const newDate = date ? new Date(date) : findEvent.date;

    const start = startTime
      ? new Date(`${date ? date : currentDate}T${startTime}`)
      : findEvent.startTime;

    const end = endTime
      ? new Date(`${date ? date : currentDate}T${endTime}`)
      : findEvent.endTime;

    if ((date && startTime && endTime) || startTime || endTime) {
      return this.prisma.event.update({
        where: { uuid },
        data: {
          date: newDate,
          startTime: start,
          endTime: end,
          name,
          contactPhone,
          contactEmail,
          location,
          latitude,
          longitude,
          bloodBank,
          target,
          isClosed,
        },
      });
    } else if (date) {
      throw new HttpException(
        'Updade startTime or endTime',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.prisma.event.update({
        where: { uuid },
        data: updateEventDto,
      });
    }
  }

  remove(uuid: string) {
    return this.prisma.event.delete({
      where: { uuid },
    });
  }
  createPledgerForEvent(createDonorDto: CreateDonorDto, uuid: string) {
    const { dop, dopNp } = createDonorDto;

    return this.prisma.donor.create({
      data: {
        ...createDonorDto,
        dop: new Date(dop),
        dopNp: new Date(dopNp),

        eventId: uuid,
      },
    });
  }
  async createDonorForEvent(
    createDonationDto: CreateDonationDto,
    uuid: string,
  ) {
    return this.prisma.donation.create({
      data: {
        ...createDonationDto,
        eventId: uuid,
      },
    });
  }
}

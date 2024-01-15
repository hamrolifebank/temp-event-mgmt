import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('event(end-to-end)', () => {
  let app: INestApplication;
  interface Event {
    name: string;
    contactPhone: string;
    contactEmail: string;
    location: string;
    latitude: number;
    longitude: number;
    bloodBank: string;
    target: number;
    date: string;
    startTime: string;
    endTime: string;
    isClosed: boolean;
    organizationId: string;
  }
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('It should create new event', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/events')
      .send({
        name: 'Jivan Daan',
        contactPhone: '9813642931',
        contactEmail: 'raktadan@gmail.com',
        location: 'puranoBanehwor',
        latitude: 27.736833,
        longitude: 85.354864,
        bloodBank: 'Rumsan',
        target: 30,
        date: '2024-03-10',
        startTime: '08:30:00',
        endTime: '11:30:00',
        isClosed: false,
      });

    expect(createResponse.status).toBe(201);

    const deleteOrg = await request(app.getHttpServer()).delete(
      `/events/${createResponse.body.uuid}`,
    );
    expect(deleteOrg.status).toBe(200);
  });

  it('create event associate with organization', async () => {
    const createOrg = await request(app.getHttpServer())
      .post('/organizations')
      .send({
        name: 'Jiwan Daan garau',
        email: 'blood@gmail.com',
        phone: '9843866512',
        address: 'Sanapa',
        isBloodBank: true,
      });
    const orgId = createOrg.body.uuid;

    const createResponse = await request(app.getHttpServer())
      .post('/events')
      .send({
        name: 'Nest',
        contactPhone: '9813642931',
        contactEmail: 'raktadan@gmail.com',
        location: 'puranoBanehwor',
        latitude: 27.736833,
        longitude: 85.354864,
        bloodBank: 'Rumsan',
        target: 30,
        date: '2024-03-10',
        startTime: '08:30:00',
        endTime: '11:30:00',
        isClosed: false,
        organizationId: orgId,
      });
    expect(createResponse.status).toBe(201);
    const createdEvent = createResponse.body;

    const getOrgWithEventsResponse = await request(app.getHttpServer())
      .get(`/organizations/${orgId}`)
      .query({ withEvents: true });

    const organizatonWithEvents = getOrgWithEventsResponse.body;
    const associatedEvents = organizatonWithEvents.events;

    const doesContainExpectedEvent = associatedEvents.some(
      (event: Event) =>
        event.name === createdEvent.name && event.date === createdEvent.date,
    );

    expect(doesContainExpectedEvent).toBe(true);
  });

  it('it should return all the events', async () => {
    const response = await request(app.getHttpServer()).get('/events');
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((event: Event) => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('uuid');
      expect(event).toHaveProperty('name');
      expect(event).toHaveProperty('contactPhone');
      expect(event).toHaveProperty('contactEmail');
      expect(event).toHaveProperty('location');
      expect(event).toHaveProperty('latitude');
      expect(event).toHaveProperty('longitude');
      expect(event).toHaveProperty('bloodBank');
      expect(event).toHaveProperty('target');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('startTime');
      expect(event).toHaveProperty('endTime');
      expect(event).toHaveProperty('isClosed');
    });
  });

  it('It should return single event by uuid', async () => {
    const orgList = await request(app.getHttpServer()).get('/events');
    const getFirstEvent = orgList.body[0];
    return await request(app.getHttpServer())
      .get(`/events/${getFirstEvent.uuid}`)
      .expect(HttpStatus.OK);
  });

  it('It should update event', async () => {
    const getEvents = await request(app.getHttpServer()).get('/events');
    const eventToUpdate = getEvents.body[0];

    const updateObj = {
      target: 40,
    };
    const response = await request(app.getHttpServer())
      .put(`/events/${eventToUpdate.uuid}`)
      .send(updateObj);
    expect(response.status).toBe(200);
    const updatedEvntResponse = await request(app.getHttpServer()).get(
      `/events/${eventToUpdate.uuid}`,
    );
    const updatedEvent = updatedEvntResponse.body;

    expect(updatedEvent.target).toBe(updateObj.target);
  });

  it('It should add pledger', async () => {
    const getAllEvents = await request(app.getHttpServer()).get('/events');

    const getEvent = getAllEvents.body[0];

    const createPledgerResponse = await request(app.getHttpServer())
      .post(`/events/${getEvent.uuid}/pledgers`)
      .send({
        name: 'Arju Pasang',
        phone: '9803645450',
        email: 'arju12@gmail.com',
        dop: '1994-02-24',
        dopNp: '2051-02-14',
        gender: 'F',
        bloodGroup: 'B_POSITIVE',
        location: 'lalitpur',
      });
    expect(createPledgerResponse.status).toBe(201);
  });

  it('It should make a donation', async () => {
    const getAllEvents = await request(app.getHttpServer()).get('/events');
    const getEvent = getAllEvents.body[0];
    const getPledgerofEvent = await request(app.getHttpServer()).get(
      `/events/${getEvent.uuid}/pledgers`,
    );

    const getPledgerId = getPledgerofEvent.body.donors[0].uuid;

    const createDonationResponse = await request(app.getHttpServer())
      .post(`/events/${getEvent.uuid}/donors`)
      .send({
        bloodBagType: 'SINGLE',
        bloodBagId: '12',
        tubeId: '128',
        consentUrl: '/Users/surendra/Desktop/consent.jpeg',
        rejectReason: { medicine_user: true, low_pressure: true, hb_low: true },
        donorId: getPledgerId,
      });

    expect(createDonationResponse.status).toBe(201);
  });

  it('It should reset all the table', async () => {
    //delete donations
    const getDonationToDelete = await request(app.getHttpServer()).get(
      '/donations',
    );

    const deleteDonation = await request(app.getHttpServer()).delete(
      `/donations/${getDonationToDelete.body[0].uuid}`,
    );
    expect(deleteDonation.status).toBe(200);

    //delete donor

    const getDonorToDelete = await request(app.getHttpServer()).get('/donors');

    const deleteDonor = await request(app.getHttpServer()).delete(
      `/donors/${getDonorToDelete.body[0].uuid}`,
    );
    expect(deleteDonor.status).toBe(200);

    //delete org
    const getOrgToDelete = await request(app.getHttpServer()).get(
      '/organizations',
    );

    const deleteOrg = await request(app.getHttpServer()).delete(
      `/organizations/${getOrgToDelete.body[0].uuid}`,
    );
    expect(deleteOrg.status).toBe(200);

    //delete event
    const getEventToDelete = await request(app.getHttpServer()).get('/events');

    const deleteEvent = await request(app.getHttpServer()).delete(
      `/events/${getEventToDelete.body[0].uuid}`,
    );
    expect(deleteEvent.status).toBe(200);
  });
});

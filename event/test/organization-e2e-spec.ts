import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';

import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('organization (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('It should create new organizaion', () => {
    return request(app.getHttpServer())
      .post('/organizations')
      .send({
        name: 'Jiwan Daan garau',
        email: 'blood@gmail.com',
        phone: '9843866512',
        address: 'Sanapa',
        isBloodBank: true,
      })
      .expect(201);
  });

  it('It should return all the list of the organizations', async () => {
    const response = await request(app.getHttpServer()).get('/organizations');
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((organisation: any) => {
      expect(organisation).toHaveProperty('id');
      expect(organisation).toHaveProperty('uuid');
      expect(organisation).toHaveProperty('name');
      expect(organisation).toHaveProperty('phone');
      expect(organisation).toHaveProperty('email');
      expect(organisation).toHaveProperty('address');
      expect(organisation).toHaveProperty('isBloodBank');
      expect(organisation).toHaveProperty('createdAt');
      expect(organisation).toHaveProperty('updatedAt');
    });
  });

  it('It should fetch individual organinsation by uuid', async () => {
    const orgList = await request(app.getHttpServer()).get('/organizations');
    const getFirstOrg = orgList.body[0];
    const response = await request(app.getHttpServer())
      .get(`/organizations/${getFirstOrg.uuid}`)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('uuid');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('phone');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('isBloodBank');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
  it('it should update the organization', async () => {
    const getOrg = await request(app.getHttpServer()).get('/organizations');
    const updateOrg = getOrg.body[0];

    const updateObj = {
      address: 'Purano-Baneshwor',
    };
    const response = await request(app.getHttpServer())
      .patch(`/organizations/${updateOrg.uuid}`)
      .send(updateObj);
    expect(response.status).toBe(200);
    const updatedOrgResponse = await request(app.getHttpServer()).get(
      `/organizations/${updateOrg.uuid}`,
    );
    const updatedOrg = updatedOrgResponse.body;

    expect(updatedOrg.address).toBe(updateObj.address);
  });

  it.only('It should delete an organization', async () => {
    const getOrg = await request(app.getHttpServer()).get('/organizations');

    const deleteOrg = getOrg.body[0];
    const getDeleteRespone = await request(app.getHttpServer()).delete(
      `/organizations/${deleteOrg.uuid}`,
    );

    expect(getDeleteRespone.status).toBe(200);
    const getDeletedResponse = await request(app.getHttpServer()).get(
      `/organizations/${deleteOrg.uuid}`,
    );

    expect(getDeletedResponse.status).toBe(404);
  });
  afterAll(async () => {
    await app.close();
  });
});

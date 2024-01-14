import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
//import { OrganizationsModule } from '../src/organizations/organizations.module';
//import { OrganizationsService } from '../src/organizations/organizations.service';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('organization (e2e)', () => {
  let app: INestApplication;
  let organizationService: { findAll: () => ['test'] };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // const moduleRef = await Test.createTestingModule({
    //   imports: [OrganizationsModule],
    // })
    //   .overrideProvider(OrganizationsService)
    //   .useValue(organizationService)
    //   .compile();

    // app = moduleRef.createNestApplication();
    // await app.init();
  });

  it('It should create new organizaion', () => {
    return request(app.getHttpServer())
      .post('/organizations')
      .send({
        name: 'BloodDonate',
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
    // return request(app.getHttpServer())
    //   .get('/organizations')
    //   .expect(200)
    //   .expect({
    //     data: organizationService.findAll(),
    //   });
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
  it.only('it should update the organization', async () => {
    const getOrg = await request(app.getHttpServer()).get('/organizations');
    // const updateOrg =  getOrg.body[0]
    // const updateObj = {

    // }
    // const response =  await request(app.getHttpServer()).update(`/organizations/${dele}`)
  });
  afterAll(async () => {
    await app.close();
  });
});

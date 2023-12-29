import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DonorsModule } from './donors/donors.module';

import { ConsentsModule } from './consents/consents.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    EventsModule,
    OrganizationsModule,
    DonorsModule,
    ConsentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

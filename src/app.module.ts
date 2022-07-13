import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FlightsModule } from './flights/flights.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.DATABASE_URL}`),
    UsersModule,
    AuthModule,
    FlightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/userobj.decorator';
import { User } from 'src/users/schemas/users.schema';
import { Response } from 'express';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post('book')
  @UseGuards(AuthGuard('jwt'))
  reserveFlight(
    @UserObj() user: User,
    @Body() createFlightDto: CreateFlightDto,
    @Res() res: Response,
  ) {
    return this.flightsService.reserveFlight(user, createFlightDto, res);
  }

  @Patch('unbook')
  @UseGuards(AuthGuard('jwt'))
  unBookFlight(
    @UserObj() user: User,
    @Body() updateFlightDto: UpdateFlightDto,
    @Res() res: Response,
  ) {
    return this.flightsService.unBookFlight(user, updateFlightDto, res);
  }

  @Get()
  findAll() {
    return this.flightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.flightsService.update(id);
  }
}

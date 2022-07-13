import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { ifNoData } from 'src/utils/repeatable-errors';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Flight } from './schemas/flight.schema';

interface findFlight {
  flightNumber: string;
  fromDate: string;
}

const uniqueIdsValues = (
  arrayToConvert: Array<Types.ObjectId>,
): Array<Types.ObjectId> => {
  const setReservations = [
    ...new Set(arrayToConvert.map((userId) => userId.toString())),
  ];
  return setReservations.map((userId) => new Types.ObjectId(userId));
};

@Injectable()
export class FlightsService {
  constructor(@InjectModel(Flight.name) private flightModel: Model<Flight>) {}

  private async create(createFlightDto: CreateFlightDto) {
    const flight = await this.flightModel.create(createFlightDto);
    return await flight.save();
  }

  async findAll() {
    const flights = await this.flightModel.find();
    return flights;
  }

  async findOne(id: string) {
    const flight = await this.flightModel.findById(id);
    ifNoData(flight, 'Flight');
    return flight;
  }

  async findAny(options: findFlight) {
    const flight = await this.flightModel.findOne(options);
    ifNoData(flight, 'Flight');
    return flight;
  }

  async findByNumberAndDate(options: findFlight) {
    const flight = await this.flightModel.findOne(options);
    return flight;
  }

  async update(id: string) {
    const flight = await this.flightModel.findById(id);
    ifNoData(flight, 'Flight');
  }

  async reserveFlight(
    user: User,
    createFlightDto: CreateFlightDto,
    res: Response,
  ) {
    if (!user.creditCard.completed) {
      throw new ForbiddenException(
        'First you have to updated your credit card!',
      );
    }
    const { flightNumber, fromDate } = createFlightDto;
    let flight = await this.findByNumberAndDate({ flightNumber, fromDate });
    if (!flight) {
      flight = await this.create(createFlightDto);
    }
    flight.reservations.push(user._id);
    flight.reservations = uniqueIdsValues(flight.reservations);
    user.flights.push(flight._id);
    user.flights = uniqueIdsValues(user.flights);
    await Promise.all([user.save(), flight.save()]);
    return res.json({
      status: 200,
      message: 'You have booked a flight',
      data: flight,
    });
  }
  async unBookFlight(
    user: User,
    updateFlightDto: UpdateFlightDto,
    res: Response,
  ) {
    const { flightNumber, fromDate } = updateFlightDto;
    const flight = await this.findByNumberAndDate({ flightNumber, fromDate });
    ifNoData(flight, 'Flight');
    flight.reservations = flight.reservations.filter(
      (userId) => userId.toString() === user._id.toString(),
    );
    user.flights = user.flights.filter(
      (flightId) => flightId.toString() === flight._id.toString(),
    );
    await Promise.all([user.save(), flight.save()]);
    return res.json({
      status: 200,
      message: 'You have resigned from a flight',
      data: flight,
    });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserObj } from 'src/decorators/userobj.decorator';
import { User } from './schemas/users.schema';
import { UpdateCreditCardDto } from './dto/update-card.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@UserObj() user: User) {
    return user;
  }

  @Patch('card')
  @UseGuards(AuthGuard('jwt'))
  updateCreditCard(
    @UserObj() user: User,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.usersService.updateCreditCard(user, updateCreditCardDto);
  }

  @Get('reservations')
  @UseGuards(AuthGuard('jwt'))
  getReservations(@UserObj() user: User) {
    return this.usersService.getReservations(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  update(@UserObj() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  remove(@UserObj() user: User) {
    return this.usersService.remove(user);
  }
}

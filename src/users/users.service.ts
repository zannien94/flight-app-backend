import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCreditCardDto } from './dto/update-card.dto';
import { ifNoData } from 'src/utils/repeatable-errors';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(createUserDto);
    return await newUser.save();
  }

  async findAll() {
    const users = await this.userModel.find({ removed: false });
    return users;
  }
  async findOne(id: string) {
    const user = await this.userModel.findById(id, { removed: false });
    ifNoData(user, 'User');
    return user;
  }

  async findAny(options: object) {
    const user = await this.userModel.findOne(options);
    ifNoData(user, 'User');
    return user;
  }

  async findByCrrToken(options: object) {
    return await this.userModel.findOne(options);
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    Object.assign(user, updateUserDto);
    return await user.save();
  }

  async remove(user: User) {
    user.removed = true;
    return await user.save();
  }
}

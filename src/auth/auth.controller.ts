import { Controller, Post, Body, Delete, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserObj } from 'src/decorators/userobj.decorator';
import { User } from 'src/users/schemas/users.schema';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async logIn(@Body() logInDto: LogInDto, @Res() res: Response) {
    await this.authService.logIn(logInDto, res);
  }

  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  async logOut(@UserObj() user: User, @Res() res: Response) {
    await this.authService.logOut(user, res);
  }
}

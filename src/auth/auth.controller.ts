import { Controller, Post, Body, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
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
  async logOut() {
    // return await this.authService.logOut();
    return 'Log Out';
  }
}

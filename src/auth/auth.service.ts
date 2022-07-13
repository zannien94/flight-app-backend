import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { LogInDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { jwtCookieConfig } from 'src/config/cookie.config';
import { JwtPayload } from './jwt.strategy';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { currentTokenId };
    const expiresIn = 60 * 60 * 24 * 7;
    const accessToken = sign(payload, process.env.JWT_SECRET, { expiresIn });
    return { accessToken, expiresIn };
  }

  private async generateToken(user: User): Promise<string> {
    let token = '';
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await this.usersService.findByCrrToken({
        currentTokenId: token,
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();
    return token;
  }

  async logIn(logInDto: LogInDto, res: Response) {
    const iat = Date.now();
    const user = await this.usersService.findAny({ email: logInDto.email });
    if (user.removed) {
      throw new NotFoundException('This user was removed');
    }
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    if (!(await user.authenticate(logInDto.password))) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const token = this.createToken(await this.generateToken(user));
    return res
      .cookie(
        'jwt',
        token.accessToken,
        jwtCookieConfig(new Date(iat + 60 * 60 * 24 * 1000 * 7)),
      )
      .json({ statusCode: 201, message: 'Your are logged in successfully' });
  }
  async logOut(user: User, res: Response) {
    user.currentTokenId = null;
    await user.save();
    res.clearCookie('jwt', { secure: false, httpOnly: true });
    return res.json({
      status: 200,
      message: 'Your are logged out successfully',
    });
  }
}

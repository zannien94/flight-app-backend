import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/users/schemas/users.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

export interface JwtPayload {
  currentTokenId: string;
}

function cookieExtractor(req: any): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UsersService) private usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || payload.currentTokenId) {
      return done(new UnauthorizedException(), false);
    }
    const user = this.usersService.findAny({
      currentTokenId: payload.currentTokenId,
    });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}

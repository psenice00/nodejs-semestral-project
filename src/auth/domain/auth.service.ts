import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { INCORRECT_CREDENTIALS } from 'src/common/exceptions/exception';
import { User } from 'src/users/domain/user';
import { UsersService } from 'src/users/domain/user.service';
import { LoginRequestDto } from '../controller/dto/loginRequest.dto';
import { RegisterRequestDto } from '../controller/dto/registerRequest.dto';
import { TokenResponseDto } from '../controller/dto/tokenResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  getAccessToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, username: user.email },
      { expiresIn: this.tokenExpiresIn(), secret: process.env.JWT_SECRET },
    );
  }

  async register(createUserDto: RegisterRequestDto): Promise<TokenResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return {
      accessToken: this.getAccessToken(user),
      expiresAt: this.tokenExpiresIn(),
    };
  }

  async login(loginDto: LoginRequestDto): Promise<TokenResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    // don't expose if user exists or if the provided password is not correct
    if (!user) throw new UnauthorizedException(INCORRECT_CREDENTIALS);

    if (!(await bcrypt.compare(loginDto.password, user.password)))
      throw new UnauthorizedException(INCORRECT_CREDENTIALS);

    return {
      accessToken: this.getAccessToken(user),
      expiresAt: this.tokenExpiresIn(),
    };
  }

  private tokenExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN ?? '15m';
  }
}

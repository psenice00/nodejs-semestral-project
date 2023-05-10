import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../domain/auth.service';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { RegisterRequestDto } from './dto/registerRequest.dto';
import { TokenResponseDto } from './dto/tokenResponse.dto';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginRequestDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  @ApiOkResponse({ type: TokenResponseDto })
  async register(
    // mass assignment + injection
    @Body() registerDto: RegisterRequestDto,
    // sensitive information exposure + serializator
  ): Promise<TokenResponseDto> {
    return this.authService.register(registerDto);
  }
}

import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../domain/user.service';
import { UserDto } from './dto/userResponse.dto';
import { CustomClassSerializerInterceptor } from '../../common/serializer.inceptor';
import { UserAuthGuard } from 'src/auth/guards/auth.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin-auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(UserAuthGuard)
@CustomClassSerializerInterceptor(UserDto)
@Controller('/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  //only admin can list out all users
  @UseGuards(AdminAuthGuard)
  @ApiOkResponse({ type: [UserDto] })
  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({ type: UserDto })
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<UserDto> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User was not found!');
    }
    return user;
  }

  //only admin can delete user
  @UseGuards(AdminAuthGuard)
  @Delete('/:id')
  @ApiOkResponse({ type: Boolean })
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<boolean> {
    return await this.userService.delete(id);
  }
}

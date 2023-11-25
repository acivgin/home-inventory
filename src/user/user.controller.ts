import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/user-decorator';
import { EditUserDto } from './dto/edit-user-dto';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guards/jwt-guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @Patch(':id')
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.updateUser(userId, dto);
  }

  @Delete(':id')
  deleteUser(@GetUser('id') userId: number) {
    return this.userService.deleteUser(userId);
  }
}

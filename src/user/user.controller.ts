import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUserId } from '../auth/decorator/get-user-id-decorator';
import { EditUserDto } from './dto/edit-user-dto';
import { UserService } from './user.service';
import { JwtAtGuard } from '../auth/guards/jwt-at-guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtAtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getUser(@GetUser() user: User) {
    console.log();
    return user;
  }

  @Patch(':id')
  editUser(@GetUserId() userId: number, @Body() dto: EditUserDto) {
    return this.userService.updateUser(userId, dto);
  }

  @Delete(':id')
  deleteUser(@GetUserId() userId: number) {
    return this.userService.deleteUser(userId);
  }
}

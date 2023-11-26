import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { EditUserDto } from './dto/edit-user-dto';
import { UserService } from './user.service';
import { JwtAtGuard } from '../auth/guards/jwt-at-guard';

@UseGuards(JwtAtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.userService.getUser(Number(id));
  }

  @Patch(':id')
  editUser(@Param('id') id: number, @Body() editUser: EditUserDto) {
    return this.userService.updateUser(Number(id), editUser);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(Number(id));
  }
}

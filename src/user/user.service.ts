import { Injectable, NotFoundException } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user-dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async deleteUser(id: number) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.hashAt;
    return user;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    delete user.hashAt;
    return user;
  }

  async updateUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hashAt;

    return user;
  }
}

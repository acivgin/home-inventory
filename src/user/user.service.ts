import { Injectable, NotFoundException } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user-dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.hashAt;
    delete user.hashedRt;
    return user;
  }

  async deleteUser(id: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      throw error;
    }
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    users.forEach((user) => {
      delete user.hashAt;
      delete user.hashedRt;
    });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.hashAt;
    delete user.hashedRt;

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
    delete user.hashedRt;
    return user;
  }
}

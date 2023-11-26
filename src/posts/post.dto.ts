import { Prisma } from '@prisma/client';

export class PostDTO implements Prisma.PostCreateInput {
  id?: number;
  title: string;
  content: string;
  published?: boolean;
  authorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

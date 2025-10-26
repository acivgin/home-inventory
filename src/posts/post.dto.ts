export class PostDTO {
  id?: number;
  title: string;
  content: string;
  published?: boolean;
  authorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Creates a new user account.
   * @param dto - The authentication DTO containing user information.
   * @returns The created user object.
   * @throws {ForbiddenException} If the email already exists.
   */
  async signUp(dto: AuthDTO) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hashAt: await this.hashData(dto.password),
          hashedRt: await this.hashData(dto.password),
        },
      });

      delete user.hashAt;
      delete user.hashedRt;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  /**
   * Sign in a user with the provided credentials.
   * Throws ForbiddenException if the user is not found or the credentials are invalid.
   * @param dto - The authentication DTO containing the user's email and password.
   * @returns A Promise that resolves to an object containing the access and refresh tokens.
   */
  async signIn(dto: AuthDTO): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const isMatch = await argon.verify(user.hashAt, dto.password);

    if (!isMatch) {
      throw new ForbiddenException('Invalid credentials');
    }
    return await this.getTokens(user); //Save tokens in httpOnly cookies on client, to avoid XSS attacks

    //     In an Angular application, you don't directly interact with cookies for sending them to the server.
    //     The browser automatically includes the cookies with every request to the server that set the cookie,
    //     based on the cookie's properties such as domain and path.
    //     In this example, the withCredentials option is set to true in the request to the /refresh endpoint.
    //     This means that any cookies that have been set by the server for the /refresh path will be included in the request.
    //     Remember, the server must also be configured to allow credentials from the origin that your Angular app is served from.
    //     This is typically done by setting the Access - Control - Allow - Credentials header to true
    //     and the Access - Control - Allow - Origin header to the origin of your Angular app in the server's CORS configuration.
    //
    //     res.cookie('refreshToken', tokens.refresh_token, {
    //       httpOnly: true,
    //       path: '/refresh', // Cookie will be sent only to this path
    //       // other options...
    //     });

    // In Angular app
    //     this.http
    //       .get('http://your-api-url/refresh', { withCredentials: true })
    //       .subscribe((response) => {
    //         // handle the response
    //       });
  }

  /**
   * Logs out a user by removing the hashed refresh token.
   * @param userId - The ID of the user to log out.
   */
  async logOut(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null, // Only log out users that have a hashed refresh token
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  /**
   * Refreshes the access and refresh tokens for a user.
   *
   * @param userId - The ID of the user for which to refresh the tokens.
   * @param rt - The current refresh token of the user.
   *
   * This method retrieves the user from the database and verifies the provided refresh token against the hashed refresh token stored in the user's record.
   * If the user doesn't exist, or if the tokens don't match, it throws a ForbiddenException.
   *
   * @returns A Promise that resolves with the new tokens for the user.
   */
  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied');
    }

    const isMatch = await argon.verify(user.hashedRt, rt);
    if (!isMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

    return await this.getTokens(user);
  }

  /**
   * Asynchronously signs and returns JWT access and refresh tokens.
   *
   * @param userId - The ID of the user for which to sign the tokens.
   * @param email - The email of the user for which to sign the tokens.
   *
   * The payload of the tokens includes the user's ID and email.
   * The access token expires in 15 minutes.
   * The refresh token expires in 7 days.
   *
   * @returns A Promise that resolves with an object containing the access and refresh tokens.
   */
  async signTokens(userId: number, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email: email,
    };

    const [access_token, refresh_token] = await Promise.all([
      await this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      }),

      await this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  /**
   * Updates the hashed refresh token for a specific user.
   *
   * @param userId - The ID of the user to update.
   * @param hashedRt - The new hashed refresh token.
   * @returns A Promise that resolves when the update operation is completed.
   */
  async updateRtHash(userId: number, hashedRt: string) {
    return await this.prisma.user.update({
      where: {
        id: userId, // Specify the user to update by their ID
      },
      data: {
        hashedRt: await this.hashData(hashedRt), // Update the hashed refresh token
      },
    });
  }

  /**
   * Hashes the provided data using argon algorithm.
   * @param data - The data to be hashed.
   * @returns A promise that resolves to the hashed data.
   */
  private async hashData(data: string) {
    return await argon.hash(data);
  }

  /**
   * Retrieves the tokens for a given user.
   * @param user - The user object.
   * @returns A promise that resolves to the tokens.
   */
  private async getTokens(user): Promise<Tokens> {
    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}

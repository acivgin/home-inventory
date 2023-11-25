import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { EditUserDto } from '../src/user/dto';
import { AuthDTO } from 'src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';

// Begin a suite of end-to-end tests for the application
describe('App e2e', () => {
  // Declare variables for the Nest application and Prisma service
  let app: INestApplication;
  let prisma: PrismaService;

  // Before all tests, set up the application and Prisma service
  beforeAll(async () => {
    // Create a testing module with the AppModule imported
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Create a Nest application instance from the testing module
    app = moduleRef.createNestApplication();
    // Use global pipes for validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    // Initialize the application
    await app.init();
    // Start the application, listening on port 3333
    await app.listen(3333);

    // Get the Prisma service from the application
    prisma = app.get(PrismaService);
    // Clean the database
    await prisma.cleanDb();
    // Set the base URL for pactum requests
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  // After all tests, close the application
  afterAll(() => {
    app.close();
  });

  // Begin a suite of tests for the authentication functionality
  describe('Auth', () => {
    // Define a data transfer object for authentication
    const dto: AuthDTO = {
      email: 'adis.civgin@gmail.com',
      password: '123',
    };

    // Begin a suite of tests for the signup functionality
    describe('Signup', () => {
      // Test that an error is thrown if the email is empty
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      // Test that an error is thrown if the password is empty
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      // Test that an error is thrown if no body is provided
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      // Test that a user can sign up
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    // Begin a suite of tests for the signin functionality
    describe('Signin', () => {
      // Test that an error is thrown if the email is empty
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      // Test that an error is thrown if the password is empty
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      // Test that an error is thrown if no body is provided
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      // Test that a user can sign in
      it('should signin', () => {
        return (
          pactum
            .spec()
            .post('/auth/signin')
            .withBody(dto)
            .expectStatus(200)
            // Store the 'access_token' response in a variable named 'userAt' for future use in the test suite
            .stores('userAt', 'access_token')
        );
      });
    });
  });

  // Begin a suite of tests for the user functionality
  describe('User', () => {
    // Begin a suite of tests for the 'Get me' functionality
    describe('Get me', () => {
      // Test that the current user can be retrieved
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    // Begin a suite of tests for the 'Edit user' functionality
    describe('Edit user', () => {
      // Test that a user can be edited
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Sabahudin',
          email: 'sabahudin.civgin@yahoo.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  // describe('Bookmarks', () => {
  //   describe('Get empty bookmarks', () => {
  //     it('should get bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectBody([]);
  //     });
  //   });

  //   describe('Create bookmark', () => {
  //     const dto: CreateBookmarkDto = {
  //       title: 'First Bookmark',
  //       link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
  //     };
  //     it('should create bookmark', () => {
  //       return pactum
  //         .spec()
  //         .post('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(201)
  //         .stores('bookmarkId', 'id');
  //     });
  //   });

  //   describe('Get bookmarks', () => {
  //     it('should get bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectJsonLength(1);
  //     });
  //   });

  //   describe('Get bookmark by id', () => {
  //     it('should get bookmark by id', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectBodyContains('$S{bookmarkId}');
  //     });
  //   });

  //   describe('Edit bookmark by id', () => {
  //     const dto: EditBookmarkDto = {
  //       title:
  //         'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
  //       description:
  //         'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
  //     };
  //     it('should edit bookmark', () => {
  //       return pactum
  //         .spec()
  //         .patch('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(200)
  //         .expectBodyContains(dto.title)
  //         .expectBodyContains(dto.description);
  //     });
  //   });

  //   describe('Delete bookmark by id', () => {
  //     it('should delete bookmark', () => {
  //       return pactum
  //         .spec()
  //         .delete('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(204);
  //     });

  //     it('should get empty bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectJsonLength(0);
  //     });
  //});
  //});
});

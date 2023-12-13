import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { AppModule } from './../src/app.module';

/**
 * Default API prefix.
 */
const DEFAULT_PREFIX = '/api/v1';

describe('AppController (e2e)', () => {
  const prefix = process.env.PREFIX || DEFAULT_PREFIX;
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.setGlobalPrefix(prefix);
    app.enableCors();
    app.register(compression);
    app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidUnknownValues: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`GET ${prefix}/examples/address/:zipCode`, () => {
    return app
      .inject({
        method: 'GET',
        url: `${prefix}/examples/address/80740020`,
      })
      .then(({ payload }) => {
        expect(JSON.parse(payload)).toEqual({
          zipCode: '80740-020',
          streetAddress: 'Rua Desembargador Augusto Guimarães Cortes',
          district: 'Campina do Siqueira',
          city: 'Curitiba',
          stateCode: 'PR',
        });
      });
  });

  it(`GET ${prefix}/examples/address/:zipCode NotFoundException`, () => {
    return app
      .inject({
        method: 'GET',
        url: `${prefix}/examples/address/00000000`,
      })
      .then(({ payload }) => {
        expect(JSON.parse(payload)).toEqual({
          statusCode: 404,
          message: 'Zip Code 00000000 not found',
          error: 'Not Found',
        });
      });
  });
});

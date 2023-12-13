import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { getErrorCode, getErrorMessage } from './error.utils';

describe('ErrorUtils', () => {
  it('should get error code', () => {
    expect(getErrorCode('Bad Request')).toBe('BAD_REQUEST');
  });

  it('should get error code from exception', () => {
    const exception = new BadRequestException('Bad Request');
    expect(getErrorCode(exception.getResponse())).toBe('BAD_REQUEST');
  });

  it('should get error message', () => {
    const exception = 'Error message';
    expect(getErrorMessage(exception)).toBe('Error message');
  });

  it('should get error message from exception', () => {
    const exception = new NotFoundException('Not found');
    expect(getErrorMessage(exception.getResponse())).toBe('Not found');
  });

  it('should get error message from bad request exception - exists', () => {
    const validatorError: ValidationError = {
      target: {
        email: 'not@existing.email',
      },
      value: 'not@existing.email',
      property: 'email',
      children: [],
      constraints: {
        exists: 'email address does not exists',
      },
    };
    const exception = new BadRequestException({
      message: [validatorError],
    });
    expect(getErrorMessage(exception.getResponse())).toBe(
      'email address does not exists',
    );
  });

  it('should get error message from bad request exception - two constraints', () => {
    const validatorError: ValidationError = {
      target: {
        email: null,
      },
      value: null,
      property: 'email',
      children: [],
      constraints: {
        isNotEmpty: 'email not be empty',
        isString: 'email not be null',
      },
    };
    const exception = new BadRequestException({
      message: [validatorError],
    });
    expect(getErrorMessage(exception.getResponse())).toBe(
      'email not be empty -- email not be null',
    );
  });

  it('should get error message from bad request children exception', () => {
    const validatorError: ValidationError = {
      target: {
        email: '',
      },
      value: '',
      property: 'email',
      children: [
        {
          target: {
            email: null,
          },
          value: null,
          property: 'email',
          children: [],
          constraints: {
            isString: 'email not be null',
          },
        },
      ],
      constraints: {
        isNotEmpty: 'email not be empty',
      },
    };
    const exception = new BadRequestException({
      message: [validatorError],
    });
    expect(getErrorMessage(exception.getResponse())).toBe('email not be null');
  });

  it('should get invalid parameter message from bad request exception', () => {
    const validatorError: ValidationError = {
      property: 'email',
      children: [],
    };
    const exception = new BadRequestException({
      message: [validatorError],
    });
    expect(getErrorMessage(exception.getResponse())).toBe('Invalid parameter');
  });

  it('should get INTERNAL_SERVER_ERROR message from exception', () => {
    const exception = new InternalServerErrorException(true);
    expect(getErrorMessage(exception.getResponse())).toBe(
      'INTERNAL_SERVER_ERROR',
    );
  });
});

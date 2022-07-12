import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { MongoServerError } from 'mongodb';

const convertExceptionFields = (exception: unknown): [string, number] => {
  let message = 'Something wrong happened';
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  if (exception instanceof HttpException) {
    status = exception.getStatus();
    const nestedResponse = JSON.parse(JSON.stringify(exception.getResponse()));
    message = nestedResponse.message ? nestedResponse.message : nestedResponse;
  } else if (
    exception instanceof MongoServerError &&
    exception.code === 11000
  ) {
    message = exception.message;
    status = 409;
  } else if (
    exception instanceof Error.CastError ||
    exception instanceof Error.ValidationError ||
    exception instanceof Error.ValidatorError
  ) {
    status = 400;
    message = exception.message;
  }
  status === HttpStatus.INTERNAL_SERVER_ERROR && console.error(exception);
  return [message, status];
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    //Delete it
    console.log(exception);
    const [message, status] = convertExceptionFields(exception);
    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
    });
  }
}

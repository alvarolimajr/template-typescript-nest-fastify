import { requestContext } from '@fastify/request-context';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

const REQUEST_ID_HEADER_KEY = 'x-request-id';
const REQUEST_ID_CONTEXT_KEY = 'requestId';

declare module '@fastify/request-context' {
  interface RequestContextData {
    requestId: string;
  }
}

const fastifyRequestIdHookHandler = (
  req: FastifyRequest,
  _: FastifyReply,
  done: HookHandlerDoneFunction,
) => {
  const requestId = req.headers[REQUEST_ID_HEADER_KEY] as string;
  requestContext.set(REQUEST_ID_CONTEXT_KEY, requestId);
  done();
};

export {
  fastifyRequestIdHookHandler,
  REQUEST_ID_HEADER_KEY,
  REQUEST_ID_CONTEXT_KEY,
};

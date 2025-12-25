import type { FastifyRequest, FastifyReply } from 'fastify';

interface RouteGenericInterface {
    Body?: unknown;
    Querystring?: unknown;
    Params?: unknown;
    Headers?: unknown;
}

type FastifyHandler<T extends RouteGenericInterface = RouteGenericInterface> = (
    request: FastifyRequest<T>,
    reply: FastifyReply
) => Promise<any> | any;

function RequestHandler<T extends RouteGenericInterface = RouteGenericInterface>(func: FastifyHandler<T>) {
    return async (request: FastifyRequest<T>, reply: FastifyReply) => {
        try {
            const result = await Promise.resolve(func(request, reply));
            return result;
        } catch (error) {
            request.log.error(error);

            if (error instanceof Error) {
                return reply.code(500).send({
                    success: false,
                    error: error.message,
                    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
                });
            }

            return reply.code(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    };
}

export default RequestHandler;

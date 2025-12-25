// utils/ResponseHandler.ts
import type { FastifyReply } from 'fastify';

/**
 * Standard API Response Interface
 */
interface APIResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    metadata?: {
        timestamp: string;
        requestId?: string;
        pagination?: {
            page: number;
            limit: number;
            totalPages: number;
            totalItems: number;
            hasNext: boolean;
            hasPrevious: boolean;
        };
    };
}

/**
 * Pagination Options
 */
interface PaginationOptions {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

class ResponseHandler {
    /**
     * Send a successful response
     */
    static success<T>(
        reply: FastifyReply,
        data: T,
        message?: string,
        statusCode: number = 200
    ): FastifyReply {
        const response: APIResponse<T> = {
            success: true,
            message: message || 'Request successful',
            data,
            metadata: {
                timestamp: new Date().toISOString()
            }
        };

        return reply.code(statusCode).send(response);
    }

    /**
     * Send a successful response with pagination
     */
    static successWithPagination<T>(
        reply: FastifyReply,
        data: T,
        pagination: PaginationOptions,
        message?: string
    ): FastifyReply {
        const { page, limit, totalItems, totalPages } = pagination;

        const response: APIResponse<T> = {
            success: true,
            message: message || 'Request successful',
            data,
            metadata: {
                timestamp: new Date().toISOString(),
                pagination: {
                    page,
                    limit,
                    totalPages,
                    totalItems,
                    hasNext: page < totalPages,
                    hasPrevious: page > 1
                }
            }
        };

        return reply.code(200).send(response);
    }

    /**
     * Send a created response (201)
     */
    static created<T>(
        reply: FastifyReply,
        data: T,
        message?: string
    ): FastifyReply {
        return this.success(reply, data, message || 'Resource created successfully', 201);
    }

    /**
     * Send an accepted response (202)
     */
    static accepted(
        reply: FastifyReply,
        message?: string
    ): FastifyReply {
        const response: APIResponse = {
            success: true,
            message: message || 'Request accepted for processing',
            metadata: {
                timestamp: new Date().toISOString()
            }
        };

        return reply.code(202).send(response);
    }

    /**
     * Send a no content response (204)
     */
    static noContent(reply: FastifyReply): FastifyReply {
        return reply.code(204).send();
    }

    /**
     * Send an error response
     */
    static error(
        reply: FastifyReply,
        message: string,
        statusCode: number = 500,
        error?: any
    ): FastifyReply {
        const response: APIResponse = {
            success: false,
            message,
            error: error?.message || error || 'An error occurred',
            metadata: {
                timestamp: new Date().toISOString()
            }
        };

        // Include stack trace in development
        if (process.env.NODE_ENV === 'development' && error?.stack) {
            (response as any).stack = error.stack;
        }

        return reply.code(statusCode).send(response);
    }

    /**
     * Send a bad request error (400)
     */
    static badRequest(
        reply: FastifyReply,
        message: string = 'Bad request',
        error?: any
    ): FastifyReply {
        return this.error(reply, message, 400, error);
    }

    /**
     * Send an unauthorized error (401)
     */
    static unauthorized(
        reply: FastifyReply,
        message: string = 'Unauthorized',
        error?: any
    ): FastifyReply {
        return this.error(reply, message, 401, error);
    }

    /**
     * Send a forbidden error (403)
     */
    static forbidden(
        reply: FastifyReply,
        message: string = 'Forbidden',
        error?: any
    ): FastifyReply {
        return this.error(reply, message, 403, error);
    }

    /**
     * Send a not found error (404)
     */
    static notFound(
        reply: FastifyReply,
        message: string = 'Resource not found',
        error?: any
    ): FastifyReply {
        return this.error(reply, message, 404, error);
    }

    /**
     * Send a conflict error (409)
     */
    static conflict(
        reply: FastifyReply,
        message: string = 'Resource conflict',
        error?: any
    ): FastifyReply {
        return this.error(reply, message, 409, error);
    }

    /**
     * Send a validation error (422)
     */
    static validationError(
        reply: FastifyReply,
        message: string = 'Validation failed',
        validationErrors?: any
    ): FastifyReply {
        const response: APIResponse = {
            success: false,
            message,
            error: 'Validation error',
            data: validationErrors,
            metadata: {
                timestamp: new Date().toISOString()
            }
        };

        return reply.code(422).send(response);
    }

    /**
     * Send a too many requests error (429)
     */
    static tooManyRequests(
        reply: FastifyReply,
        message: string = 'Too many requests',
        retryAfter?: number
    ): FastifyReply {
        if (retryAfter) {
            reply.header('Retry-After', retryAfter.toString());
        }
        return this.error(reply, message, 429);
    }

    /**
     * Send an internal server error (500)
     */
    static internalError(
        reply: FastifyReply,
        message: string = 'Internal server error',
        error?: any
    ): FastifyReply {
        return this.error(reply, message, 500, error);
    }

    /**
     * Send a service unavailable error (503)
     */
    static serviceUnavailable(
        reply: FastifyReply,
        message: string = 'Service unavailable',
        error?: any
    ): FastifyReply {
        return this.error(reply, message, 503, error);
    }

    /**
     * Send a custom response
     */
    static custom<T>(
        reply: FastifyReply,
        statusCode: number,
        success: boolean,
        message: string,
        data?: T,
        error?: any
    ): FastifyReply {
        const response: APIResponse<T> = {
            success,
            message,
            ...(data && { data }),
            ...(error && { error: error?.message || error }),
            metadata: {
                timestamp: new Date().toISOString()
            }
        };

        return reply.code(statusCode).send(response);
    }
}

export default ResponseHandler;

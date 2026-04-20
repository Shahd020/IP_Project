/**
 * Custom application error that carries an HTTP status code.
 *
 * `isOperational: true` signals to the global error handler that this is
 * an *expected* failure (bad input, not found, etc.) and should be sent to
 * the client as-is. Programmer errors (bugs) will have isOperational: false
 * and will result in a generic 500 response.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 404).
   * @param {string} message    - Human-readable error description sent to the client.
   * @param {boolean} [isOperational=true]
   */
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  /** 400 Bad Request */
  static badRequest(message = 'Bad Request') {
    return new ApiError(400, message);
  }

  /** 401 Unauthorised */
  static unauthorized(message = 'Unauthorised') {
    return new ApiError(401, message);
  }

  /** 403 Forbidden */
  static forbidden(message = 'Access denied') {
    return new ApiError(403, message);
  }

  /** 404 Not Found */
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  /** 409 Conflict */
  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  /** 422 Unprocessable Entity */
  static unprocessable(message = 'Unprocessable entity') {
    return new ApiError(422, message);
  }

  /** 429 Too Many Requests */
  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message);
  }
}

export default ApiError;

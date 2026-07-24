/**
 * Sends a standardised success response.
 * @param {object} res - Express response
 * @param {*} data - payload
 * @param {string} [message]
 * @param {object} [pagination] - optional pagination metadata
 * @param {number} [status=200]
 */
export function sendSuccess(res, data, message = '', pagination = null, status = 200) {
  const body = { success: true, data };
  if (message) body.message = message;
  if (pagination) body.pagination = pagination;
  return res.status(status).json(body);
}

/**
 * Sends a standardised error response.
 * @param {object} res - Express response
 * @param {number} status - HTTP status code
 * @param {string} message - error message
 * @param {*} [error] - optional error detail (stripped in production)
 */
export function sendError(res, status, message, error = null) {
  const body = { success: false, message };
  if (error && process.env.NODE_ENV !== 'production') body.error = error;
  return res.status(status).json(body);
}

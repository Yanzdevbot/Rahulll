/**
 * Runs a middleware function and returns a promise that resolves or rejects
 * based on whether the middleware function calls the callback with an error
 * or not.
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {Function} fn
 * @returns {Promise<unknown>}
 */
export default function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
}

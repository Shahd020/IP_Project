import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Reads the error bag populated by express-validator chains and — if any
 * errors exist — forwards a 400 ApiError with a concatenated message.
 *
 * Place this middleware AFTER the validator chain and BEFORE the controller:
 *
 *   router.post(
 *     '/register',
 *     authValidators.register,   // express-validator rules array
 *     validate,                  // this middleware
 *     authController.register    // controller runs only if input is clean
 *   );
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');

    return next(ApiError.badRequest(message));
  }

  next();
};

export default validate;

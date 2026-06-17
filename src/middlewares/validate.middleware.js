const ApiError = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {

    const result =
      schema.safeParse(req.body);

    if (!result.success) {

      const errors =
      result.error.issues.map(
        (err) => err.message
      );

      return next(
        new ApiError(
          400,
          errors.join(", ")
        )
      );
    }

    req.body = result.data;

    next();
  };
};

module.exports = validate;
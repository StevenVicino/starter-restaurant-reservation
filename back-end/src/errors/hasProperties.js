function hasProperties(...props) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    try {
      props[0].forEach((prop) => {
        if (!data[prop]) {
          const error = new Error(`A ${prop} property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;

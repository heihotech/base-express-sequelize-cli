const controller = require("../controllers/provinsi.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/provinsi",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllProvinsi
  );

  app.get(
    "/api/provinsi/:provinsiId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findProvinsi
  );

  app.post(
    "/api/provinsi",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createProvinsi
  );

  app.put(
    "/api/provinsi/:provinsiId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateProvinsi
  );

  app.delete(
    "/api/provinsi/:provinsiId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteProvinsi
  );
};

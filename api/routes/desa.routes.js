const controller = require("../controllers/desa.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/desa",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllDesa
  );

  app.get(
    "/api/desa/:desaId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findDesa
  );

  app.post(
    "/api/desa",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createDesa
  );

  app.put(
    "/api/desa/:desaId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateDesa
  );

  app.delete(
    "/api/desa/:desaId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteDesa
  );
};

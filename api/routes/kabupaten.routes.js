const controller = require("../controllers/kabupaten.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/kabupaten",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllKabupaten
  );

  app.get(
    "/api/kabupaten/:kabupatenId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findKabupaten
  );

  app.post(
    "/api/kabupaten",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createKabupaten
  );

  app.put(
    "/api/kabupaten/:kabupatenId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateKabupaten
  );

  app.delete(
    "/api/kabupaten/:kabupatenId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteKabupaten
  );
};

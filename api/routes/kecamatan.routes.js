const controller = require("../controllers/kecamatan.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/kecamatan",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllKecamatan
  );

  app.get(
    "/api/kecamatan/:kecamatanId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findKecamatan
  );

  app.post(
    "/api/kecamatan",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createKecamatan
  );

  app.put(
    "/api/kecamatan/:kecamatanId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateKecamatan
  );

  app.delete(
    "/api/kecamatan/:kecamatanId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteKecamatan
  );
};

const controller = require("../controllers/alamat.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/alamat",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllAlamat
  );

  app.get(
    "/api/alamat/:alamatId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAlamat
  );

  app.post(
    "/api/alamat",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createAlamat
  );

  app.put(
    "/api/alamat/:alamatId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updateAlamat
  );

  app.delete(
    "/api/alamat/:alamatId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deleteAlamat
  );
};

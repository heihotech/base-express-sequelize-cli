const controller = require("../controllers/pasien.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/pasien",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findAllPasien
  );

  app.get(
    "/api/pasien/:pasienId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.findPasien
  );

  app.post(
    "/api/pasien",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.createPasien
  );

  app.put(
    "/api/pasien/:pasienId",
    [
      //   joiValidate.validate(joiValidate.schemas.category.categoryUpdatePOST),
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.updatePasien
  );

  app.delete(
    "/api/pasien/:pasienId",
    [
      //   authJwt.verifyToken,
      //   authJwt.isSimrs,
    ],
    controller.deletePasien
  );
};

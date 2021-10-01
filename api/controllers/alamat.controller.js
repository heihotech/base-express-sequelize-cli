const db = require("../../database/models");
const {
  Alamat,
  Desa,
  Kecamatan,
  Kabupaten,
  Provinsi,
} = require("../../database/models");
const moment = require("moment");
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  // for (const key in items) {
  //   items[key].dataValues.createdAtFormatted = moment(
  //     items[key].createdAt
  //   ).format("Do MMMM YYYY HH:mm:ss");
  //   items[key].dataValues.updatedAtFormatted = moment(
  //     items[key].updatedAt
  //   ).format("Do MMMM YYYY HH:mm:ss");
  // }

  return { totalItems, items, totalPages, currentPage };
};

exports.findAllAlamat = async (req, res) => {
  const {
    page,
    size,
    kodePos,
    noTelepon,
    desaId,
    order,
    orderField,
    isInactive,
  } = req.query;

  var condition = [];

  var kodePosCondition = null;
  var desaCondition = null;
  var noTeleponCondition = null;

  if (desaId) {
    desaCondition = {
      desaId: { [Op.eq]: desaId },
    };
    condition.push(desaCondition);
  }

  if (noTelepon) {
    noTeleponCondition = {
      noTelepon: { [Op.eq]: noTelepon },
    };
    condition.push(noTeleponCondition);
  }

  if (kodePos) {
    kodePosCondition = {
      [Op.or]: [
        { kodePos: { [Op.eq]: kodePos } },
        { kodePos: { [Op.iLike]: `%${kodePos}%` } },
      ],
    };
    condition.push(kodePosCondition);
  }

  const { limit, offset } = getPagination(page, size);

  await Alamat.findAndCountAll({
    where: { [Op.and]: condition },
    limit,
    offset,
    order: [[orderField ? orderField : "createdAt", order ? order : "DESC"]],
    paranoid: isInactive === "true" && isInactive != null ? false : true,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving.",
      });
    });
};

exports.findAlamat = async (req, res) => {
  await Alamat.findByPk(req.params.alamatId, {
    include: [
      {
        model: Desa,
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        include: {
          model: Kecamatan,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          include: {
            model: Kabupaten,
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            include: {
              model: Provinsi,
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
          },
        },
      },
    ],
  })
    .then((data) => {
      if (data != null) {
        res.send(data);
      } else {
        res.send({});
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating, transaction rolled back.",
      });
    });
};

exports.createAlamat = async (req, res) => {
  const alamat = {
    alamatLengkap: req.body.alamatLengkap,
    rt: req.body.rt,
    rw: req.body.rw,
    kodePos: req.body.kodePos,
    noTelepon: req.body.noTelepon,
    desaId: req.body.desaId,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdAlamat = await Alamat.create(alamat, {
        transaction: t,
      });
      return createdAlamat;
    })
    .then((data) => {
      res.send({
        data,
        status: 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating, transaction rolled back.",
      });
    });
};

exports.updateAlamat = async (req, res) => {
  const id = req.params.alamatId;
  const alamat = {};

  if (req.body.alamatLengkap) {
    alamat.alamatLengkap = req.body.alamatLengkap;
  }
  if (req.body.rt) {
    alamat.rt = req.body.rt;
  }
  if (req.body.rw) {
    alamat.rw = req.body.rw;
  }
  if (req.body.kodePos) {
    alamat.kodePos = req.body.kodePos;
  }
  if (req.body.noTelepon) {
    alamat.noTelepon = req.body.noTelepon;
  }
  if (req.body.desaId) {
    alamat.desaId = req.body.desaId;
  }

  db.sequelize
    .transaction(async (t) => {
      const updatedAlamat = await Alamat.update(alamat, {
        where: { id: id },
        transaction: t,
      });
      return updatedAlamat;
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "updated successfully.",
          id,
          status: 1,
        });
      } else {
        res.send({
          message: `Cannot update!`,
          id,
          status: 0,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while updating, transaction rolled back.",
      });
    });
};

exports.deleteAlamat = async (req, res) => {
  const id = req.params.alamatId;
  db.sequelize
    .transaction(async (t) => {
      const deletedAlamat = await Alamat.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedAlamat;
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "deleted successfully!",
          id,
          status: 1,
        });
      } else {
        res.send({
          message: `Cannot delete!`,
          id,
          status: 0,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

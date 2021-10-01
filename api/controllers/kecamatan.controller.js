const db = require("../../database/models");
const {
  Kecamatan,
  Kabupaten,
  Desa,
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

exports.findAllKecamatan = async (req, res) => {
  const { page, size, nama, kabupatenId, order, orderField, isInactive } =
    req.query;

  var condition = [];

  var namaCondition = null;
  var kabupatenCondition = null;

  if (kabupatenId) {
    kabupatenCondition = {
      kabupatenId: { [Op.eq]: kabupatenId },
    };
    condition.push(kabupatenCondition);
  }

  if (nama) {
    namaCondition = {
      [Op.or]: [
        { nama: { [Op.eq]: nama } },
        { nama: { [Op.iLike]: `%${nama}%` } },
      ],
    };
    condition.push(namaCondition);
  }

  const { limit, offset } = getPagination(page, size);

  await Kecamatan.findAndCountAll({
    where: { [Op.and]: condition },
    limit,
    offset,
    order: [[orderField ? orderField : "createdAt", order ? order : "DESC"]],
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
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

exports.findKecamatan = async (req, res) => {
  await Kecamatan.findByPk(req.params.kecamatanId, {
    include: [
      {
        model: Kabupaten,
        include: {
          model: Provinsi,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      },
      {
        model: Desa,
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
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

exports.createKecamatan = async (req, res) => {
  const kecamatan = {
    nama: req.body.nama,
    kabupatenId: req.body.kabupatenId,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdKecamatan = await Kecamatan.create(kecamatan, {
        transaction: t,
      });
      return createdKecamatan;
    })
    .then((data) => {
      res.send({ data, status: 1 });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating, transaction rolled back.",
      });
    });
};

exports.updateKecamatan = async (req, res) => {
  const id = req.params.kecamatanId;
  const kecamatan = {
    nama: req.body.nama,
    kabupatenId: req.body.kabupatenId,
  };

  db.sequelize
    .transaction(async (t) => {
      const updatedKecamatan = await Kecamatan.update(kecamatan, {
        where: { id: id },
        transaction: t,
      });
      return updatedKecamatan;
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

exports.deleteKecamatan = async (req, res) => {
  const id = req.params.kecamatanId;
  db.sequelize
    .transaction(async (t) => {
      const deletedKecamatan = await Kecamatan.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedKecamatan;
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

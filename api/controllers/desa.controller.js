const db = require("../../database/models");
const {
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

exports.findAllDesa = async (req, res) => {
  const { page, size, nama, kecamatanId, order, orderField, isInactive } =
    req.query;

  var condition = [];

  var namaCondition = null;
  var kecamatanCondition = null;

  if (kecamatanId) {
    kecamatanCondition = {
      kecamatanId: { [Op.eq]: kecamatanId },
    };
    condition.push(kecamatanCondition);
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

  await Desa.findAndCountAll({
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

exports.findDesa = async (req, res) => {
  await Desa.findByPk(req.params.desaId, {
    include: [
      {
        model: Kecamatan,
        include: {
          model: Kabupaten,
          include: {
            model: Provinsi,
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
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

exports.createDesa = async (req, res) => {
  const desa = {
    nama: req.body.nama,
    kecamatanId: req.body.kecamatanId,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdDesa = await Desa.create(desa, {
        transaction: t,
      });
      return createdDesa;
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

exports.updateDesa = async (req, res) => {
  const id = req.params.desaId;
  const desa = {
    nama: req.body.nama,
    kecamatanId: req.body.kecamatanId,
  };

  db.sequelize
    .transaction(async (t) => {
      const updatedDesa = await Desa.update(desa, {
        where: { id: id },
        transaction: t,
      });
      return updatedDesa;
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

exports.deleteDesa = async (req, res) => {
  const id = req.params.desaId;
  db.sequelize
    .transaction(async (t) => {
      const deletedDesa = await Desa.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedDesa;
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

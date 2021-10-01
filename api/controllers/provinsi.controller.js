const db = require("../../database/models");
const { Provinsi, Kabupaten } = require("../../database/models");
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

exports.findAllProvinsi = async (req, res) => {
  const { page, size, nama, order, orderField, isInactive } = req.query;

  var condition = [];

  var namaCondition = null;

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

  await Provinsi.findAndCountAll({
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

exports.findProvinsi = async (req, res) => {
  await Provinsi.findByPk(req.params.provinsiId, {
    include: {
      model: Kabupaten,
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    },
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

exports.createProvinsi = async (req, res) => {
  const provinsi = {
    nama: req.body.nama,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdProvinsi = await Provinsi.create(provinsi, {
        transaction: t,
      });
      return createdProvinsi;
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

exports.updateProvinsi = async (req, res) => {
  const id = req.params.provinsiId;
  const provinsi = {
    nama: req.body.nama,
  };

  db.sequelize
    .transaction(async (t) => {
      const updatedProvinsi = await Provinsi.update(provinsi, {
        where: { id: id },
        transaction: t,
      });
      return updatedProvinsi;
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

exports.deleteProvinsi = async (req, res) => {
  const id = req.params.provinsiId;
  db.sequelize
    .transaction(async (t) => {
      const deletedProvinsi = await Provinsi.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedProvinsi;
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

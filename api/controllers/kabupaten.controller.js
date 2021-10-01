const db = require("../../database/models");
const { Kabupaten, Provinsi, Kecamatan } = require("../../database/models");
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

exports.findAllKabupaten = async (req, res) => {
  const { page, size, nama, provinsiId, order, orderField, isInactive } =
    req.query;

  var condition = [];

  var namaCondition = null;
  var provinsiCondition = null;

  if (provinsiId) {
    provinsiCondition = {
      provinsiId: { [Op.eq]: provinsiId },
    };
    condition.push(provinsiCondition);
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

  await Kabupaten.findAndCountAll({
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

exports.findKabupaten = async (req, res) => {
  await Kabupaten.findByPk(req.params.kabupatenId, {
    include: [
      {
        model: Provinsi,
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      },
      {
        model: Kecamatan,
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

exports.createKabupaten = async (req, res) => {
  const kabupaten = {
    nama: req.body.nama,
    provinsiId: req.body.provinsiId,
  };

  db.sequelize
    .transaction(async (t) => {
      const createdKabupaten = await Kabupaten.create(kabupaten, {
        transaction: t,
      });
      return createdKabupaten;
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

exports.updateKabupaten = async (req, res) => {
  const id = req.params.kabupatenId;
  const kabupaten = {
    nama: req.body.nama,
    provinsiId: req.body.provinsiId,
  };

  db.sequelize
    .transaction(async (t) => {
      const updatedKabupaten = await Kabupaten.update(kabupaten, {
        where: { id: id },
        transaction: t,
      });
      return updatedKabupaten;
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

exports.deleteKabupaten = async (req, res) => {
  const id = req.params.kabupatenId;
  db.sequelize
    .transaction(async (t) => {
      const deletedKabupaten = await Kabupaten.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedKabupaten;
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

const db = require("../../database/models");
const {
  Pasien,
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

exports.findAllPasien = async (req, res) => {
  const {
    page,
    size,
    nama,
    noRm,
    age,
    jenisKelamin,
    order,
    orderField,
    isInactive,
  } = req.query;

  var condition = [];

  var namaCondition = null;
  var noRmCondition = null;
  var ageCondition = null;
  var jenisKelaminCondition = null;

  if (nama) {
    namaCondition = {
      [Op.or]: [
        { nama: { [Op.eq]: nama } },
        { nama: { [Op.iLike]: `%${nama}%` } },
      ],
    };
    condition.push(namaCondition);
  }
  if (noRm) {
    noRmCondition = {
      [Op.or]: [
        { noRm: { [Op.eq]: noRm } },
        { noRm: { [Op.iLike]: `%${noRm}%` } },
      ],
    };
    condition.push(noRmCondition);
  }

  //   if (age) {
  //     ageCondition = {
  //       age: { [Op.eq]: age },
  //     };
  //     condition.push(ageCondition);
  //   }

  if (jenisKelamin) {
    jenisKelaminCondition = {
      jenisKelamin: { [Op.eq]: jenisKelamin },
    };
    condition.push(jenisKelaminCondition);
  }

  const { limit, offset } = getPagination(page, size);

  await Pasien.findAndCountAll({
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

exports.findPasien = async (req, res) => {
  await Pasien.findByPk(req.params.pasienId, {
    include: [
      {
        model: Alamat,
        include: {
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
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
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

exports.createPasien = async (req, res) => {
  const pasien = {
    nama: req.body.nama,
    gelar: req.body.gelar,
    noRm: req.body.noRm,
    tanggalLahir: req.body.tanggalLahir,
    jenisKelamin: req.body.jenisKelamin,
  };
  if (req.body.tempatLahirId) {
    pasien.tempatLahirId = req.body.tempatLahirId;
  }
  if (req.body.alamatId) {
    pasien.alamatId = req.body.alamatId;
  }

  db.sequelize
    .transaction(async (t) => {
      const createdPasien = await Pasien.create(pasien, {
        transaction: t,
      });
      return createdPasien;
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

exports.updatePasien = async (req, res) => {
  const id = req.params.pasienId;
  const pasien = {};

  if (req.body.nama) {
    pasien.nama = req.body.nama;
  }
  if (req.body.gelar) {
    pasien.gelar = req.body.gelar;
  }
  if (req.body.noRm) {
    pasien.noRm = req.body.noRm;
  }
  if (req.body.tempatLahirId) {
    pasien.tempatLahirId = req.body.tempatLahirId;
  }
  if (req.body.tanggalLahir) {
    pasien.tanggalLahir = req.body.tanggalLahir;
  }
  if (req.body.jenisKelamin) {
    pasien.jenisKelamin = req.body.jenisKelamin;
  }

  db.sequelize
    .transaction(async (t) => {
      const updatedPasien = await Pasien.update(pasien, {
        where: { id: id },
        transaction: t,
      });
      return updatedPasien;
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

exports.deletePasien = async (req, res) => {
  const id = req.params.pasienId;
  db.sequelize
    .transaction(async (t) => {
      const deletedPasien = await Pasien.destroy({
        where: { id: id },
        transaction: t,
      });
      return deletedPasien;
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

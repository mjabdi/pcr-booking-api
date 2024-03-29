const express = require("express");
const router = express.Router();
const { OffDays } = require("./../../models/medex/OffDays");

router.get("/", async function (req, res, next) {
  try {
    const offDays = await OffDays.find({
      service: req?.query?.service,
    }).sort({ date: -1 });
    res.status(200).send({
      status: "OK",
      result: offDays.map((el) => {
        return {
          _id: el._id,
          date: new Date(el.date.getTime() - el.offset * 60000),
        };
      }),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/add", async function (req, res, next) {
  try {
    const { date, service, offset } = req.body;
    const offDays = new OffDays({
      date: date,
      service: service,
      offset: offset || 0
    });
    await offDays.save();
    res.status(200).send({ status: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/remove", async function (req, res, next) {
  try {
    const { id } = req.body;
    const response = await OffDays.findByIdAndDelete(id);
    if (response) {
      res.status(200).send({ status: "OK" });
    } else {
      throw Error("No Record Found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

module.exports = router;

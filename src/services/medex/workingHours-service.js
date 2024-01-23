const express = require("express");
const router = express.Router();
const { WorkingHours } = require("./../../models/medex/WorkingHours");

router.get("/", async function (req, res, next) {
  try {
    const specificServiceWorkingHours = await WorkingHours.findOne({
      service: req?.query?.service,
    });
    res
      .status(200)
      .send({ status: "OK", result: specificServiceWorkingHours || {} });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/add", async function (req, res, next) {
  try {
    const {
      service,
      startingHour,
      endingHour,
      period,
      unavailabelTimes,
      weekendStartingHour,
      weekendEndingHour,
      weekendPeriod,
      weekendUnavailabelTimes,
    } = req.body;

    if (!service) {
      throw Error("service is reauired");
    }
    if (!startingHour) {
      throw Error("startingHour is reauired");
    }
    if (!endingHour) {
      throw Error("endingHour is reauired");
    }
    if (!period) {
      throw Error("period is reauired");
    }
    if (!weekendStartingHour) {
      throw Error("weekendStartingHour is reauired");
    }
    if (!weekendEndingHour) {
      throw Error("weekendEndingHour is reauired");
    }
    if (!weekendPeriod) {
      throw Error("weekendPeriod is reauired");
    }
    const specificServiceWorkingHours = await WorkingHours.findOne({
      service: service,
    });
    if (specificServiceWorkingHours?._id) {
      await WorkingHours.findByIdAndUpdate(specificServiceWorkingHours?._id, {
        startingHour: startingHour,
        endingHour: endingHour,
        period: period,
        unavailabelTimes: unavailabelTimes,
        weekendStartingHour: weekendStartingHour,
        weekendEndingHour: weekendEndingHour,
        weekendPeriod: weekendPeriod,
        weekendUnavailabelTimes: weekendUnavailabelTimes,
      });
      res.status(200).send({ status: "OK" });
    } else {
      const offDays = new WorkingHours({
        service: service,
        startingHour: startingHour,
        endingHour: endingHour,
        period: period,
        unavailabelTimes: unavailabelTimes,
        weekendStartingHour: weekendStartingHour,
        weekendEndingHour: weekendEndingHour,
        weekendPeriod: weekendPeriod,
        weekendUnavailabelTimes: weekendUnavailabelTimes,
      });
      await offDays.save();
      res.status(201).send({ status: "OK" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

router.post("/remove", async function (req, res, next) {
  try {
    const { id } = req.body;
    const response = await WorkingHours.findByIdAndDelete(id);
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

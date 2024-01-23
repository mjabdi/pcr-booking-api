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
      startingHourMonday,
      endingHourMonday,
      periodMonday,
      startingHourTuesday,
      endingHourTuesday,
      periodTuesday,
      startingHourWednesday,
      endingHourWednesday,
      periodWednesday,
      startingHourThursday,
      endingHourThursday,
      periodThursday,
      startingHourFriday,
      endingHourFriday,
      periodFriday,
      startingHourSaturday,
      endingHourSaturday,
      periodSaturday,
      startingHourSunday,
      endingHourSunday,
      periodSunday,
    } = req.body;

    if (!service) {
      throw Error("service is reauired");
    }
    const specificServiceWorkingHours = await WorkingHours.findOne({
      service: service,
    });
    if (specificServiceWorkingHours?._id) {
      await WorkingHours.findByIdAndUpdate(specificServiceWorkingHours?._id, {
        startingHourMonday: startingHourMonday,
        endingHourMonday: endingHourMonday,
        periodMonday: periodMonday,
        startingHourTuesday: startingHourTuesday,
        endingHourTuesday: endingHourTuesday,
        periodTuesday: periodTuesday,
        startingHourWednesday: startingHourWednesday,
        endingHourWednesday: endingHourWednesday,
        periodWednesday: periodWednesday,
        startingHourThursday: startingHourThursday,
        endingHourThursday: endingHourThursday,
        periodThursday: periodThursday,
        startingHourFriday: startingHourFriday,
        endingHourFriday: endingHourFriday,
        periodFriday: periodFriday,
        startingHourSaturday: startingHourSaturday,
        endingHourSaturday: endingHourSaturday,
        periodSaturday: periodSaturday,
        startingHourSunday: startingHourSunday,
        endingHourSunday: endingHourSunday,
        periodSunday: periodSunday,
      });
      res.status(200).send({ status: "OK" });
    } else {
      const offDays = new WorkingHours({
        service: service,
        startingHourMonday: startingHourMonday,
        endingHourMonday: endingHourMonday,
        periodMonday: periodMonday,
        startingHourTuesday: startingHourTuesday,
        endingHourTuesday: endingHourTuesday,
        periodTuesday: periodTuesday,
        startingHourWednesday: startingHourWednesday,
        endingHourWednesday: endingHourWednesday,
        periodWednesday: periodWednesday,
        startingHourThursday: startingHourThursday,
        endingHourThursday: endingHourThursday,
        periodThursday: periodThursday,
        startingHourFriday: startingHourFriday,
        endingHourFriday: endingHourFriday,
        periodFriday: periodFriday,
        startingHourSaturday: startingHourSaturday,
        endingHourSaturday: endingHourSaturday,
        periodSaturday: periodSaturday,
        startingHourSunday: startingHourSunday,
        endingHourSunday: endingHourSunday,
        periodSunday: periodSunday,
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

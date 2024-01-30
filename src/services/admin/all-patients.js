const express = require("express");
const router = express.Router();
const { OldPatients } = require("../../models/medex/OldPatients");
const { Booking } = require("../../models/Booking");
router.post("/search", async function (req, res, next) {
  try {
    const { filter } = req.body;
    const regexp = new RegExp(filter, "i");
    const condition = { fullname: { $regex: regexp } };
    console.log(condition);
    const result = await Booking.aggregate([
      { $addFields: { fullname: { $concat: ["$forename", " ", "$surname"] } } },
      {
        $match: {
          $and: [{ deleted: { $ne: true } }, condition],
        },
      },
      {
        $addFields: { clinic: "pcr" },
      },
      {
        $unionWith: {
          coll: "gynaebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "gynae" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "gpbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "gp" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "stdbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "std" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "bloodbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "blood" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "dermabookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "derma" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "screeningbookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "screening" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "corporatebookings",
          pipeline: [
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "corporate" },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "bloodreports",
          pipeline: [
            { $addFields: { fullname: "$name" } },
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },

            {
              $addFields: { clinic: "Blood Result" },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "oldpatients",
          pipeline: [
            {
              $addFields: {
                fullname: {
                  $concat: [
                    {
                      $cond: {
                        if: {
                          $eq: [
                            {
                              $type: "$forename",
                            },
                            "string",
                          ],
                        },
                        then: {
                          $toLower: {
                            $trim: {
                              input: "$forename",
                            },
                          },
                        },
                        else: "", // Leave as is if not a string
                      },
                    },
                    " ",
                    {
                      $cond: {
                        if: {
                          $eq: [
                            {
                              $type: "$surname",
                            },
                            "string",
                          ],
                        },
                        then: {
                          $toLower: {
                            $trim: {
                              input: "$surname",
                            },
                          },
                        },
                        else: "", // Leave as is if not a string
                      },
                    },
                  ],
                },
              },
            },
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, condition],
              },
            },
          ],
        },
      },
      {
        $addFields: {
          birthDate: {
            $cond: {
              if: {
                $eq: [{ $type: "$birthDate" }, "date"],
              },
              then: "$birthDate",
              else: {
                $dateFromString: {
                  dateString: "$birthDate",
                  format: "%Y-%m-%d",
                },
              },
            },
          },
          gender: {
            $toLower: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $toLower: {
                        $trim: {
                          input: "$gender",
                        },
                      },
                    },
                    "m",
                  ],
                },
                then: "male",
                else: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $toLower: {
                            $trim: {
                              input: "$gender",
                            },
                          },
                        },
                        "f",
                      ],
                    },
                    then: "female",
                    else: "$gender", // Leave as is if not 'm' or 'f'
                  },
                },
              },
            },
          },
          title: {
            $toUpper: "$title",
          },
          email: {
            $toLower: "$email", // Convert email to lowercase
          },
          fullname: {
            $toLower: "$fullname",
          },
          timeStamp: "$timeStamp",
          phone: {
            $toString: "$phone", // Convert phone to string
          },
          postCode: {
            $toUpper: "$postCode", // Convert postCode to uppercase
          },
          passportNumber: {
            $toLower: "$passportNumber", // Convert passportNumber to lowercase
          },
        },
      },
      {
        $match: {
          $and: [
            {
              fullname: {
                $nin: [null, "", "-"],
              },
            },
            {
              birthDate: {
                $nin: [null, "", "-"],
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            fullname: "$fullname",
            birthDate: "$birthDate",
          },
          count: {
            $sum: 1,
          },
          bookings: {
            $addToSet: "$_id",
          },
          // Include additional fields in the group without affecting uniqueness
          title: {
            $first: "$title",
          },
          email: {
            $first: "$email",
          },
          fullname: {
            $first: "$fullname",
          },
          birthDate: {
            $first: "$birthDate",
          },
          gender: {
            $first: "$gender",
          },
          timeStamp: {
            $first: "$timeStamp",
          },
          phone: {
            $first: "$phone",
          },
          postCode: {
            $first: "$postCode",
          },
          passportNumber: {
            $first: "$passportNumber",
          },
        },
      },
      {
        $project: {
          _id: 0,
          fullname: "$fullname",
          birthDate: "$birthDate",
          gender: "$gender",
          title: 1,
          email: 1,
          timeStamp: 1,
          fullname: 1,
          phone: 1,
          postCode: 1,
          passportNumber: 1,
          bookings: 1,
        },
      },
    ])
      .limit(100)
      .exec();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ status: "FAILED", error: err.message });
  }
});

module.exports = router;

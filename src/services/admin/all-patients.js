const express = require("express");
const router = express.Router();
const { AllPatients } = require("../../models/medex/AllPatients");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Booking } = require("../../models/Booking");
router.post("/search", async function (req, res, next) {
  try {
    const { filter, birthDate } = req.body;
    const regexp = new RegExp(filter, "i");
    const condition = { fullname: { $regex: regexp } };
    if(birthDate){
      condition.birthDate = new Date(birthDate);
    }
    const result = await AllPatients.aggregate([
      {
        $match: {
          $and: [{ deleted: { $ne: true } }, condition],
        },
      },
      {
        $limit: 100, // Limit the number of results to 100
      },
      {
        $lookup: {
          from: "bookings",
          localField: "bookings",
          foreignField: "_id",
          as: "pcrDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "gynaebookings",
          localField: "bookings",
          foreignField: "_id",
          as: "gynaeDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "gpbookings",
          localField: "bookings",
          foreignField: "_id",
          as: "gpDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "stdbookings",
          localField: "bookings",
          foreignField: "_id",
          as: "stdDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "bloodbookings",
          localField: "bookings",
          foreignField: "_id",
          as: "bloodDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "dermabookings",
          localField: "bookings",
          foreignField: "_id",
          as: "dermaDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "screeningbookings",
          localField: "bookings",
          foreignField: "_id",
          as: "screeningDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "corporatebookings",
          localField: "bookings",
          foreignField: "_id",
          as: "corporateDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "bloodreports",
          localField: "bookings",
          foreignField: "_id",
          as: "bloodreportsDetails", // output array field containing the joined data
        },
      },
      {
        $lookup: {
          from: "oldpatients",
          localField: "bookings",
          foreignField: "_id",
          as: "oldPatientsDetails", // output array field containing the joined data
        },
      },
      {
        $addFields: {
          pcrDetails: {
            $map: {
              input: "$pcrDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "pcr",
                  },
                ],
              },
            },
          },
          gynaeDetails: {
            $map: {
              input: "$gynaeDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "gynae",
                  },
                ],
              },
            },
          },
          gpDetails: {
            $map: {
              input: "$gpDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "gp",
                  },
                ],
              },
            },
          },
          stdDetails: {
            $map: {
              input: "$stdDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "std",
                  },
                ],
              },
            },
          },
          bloodDetails: {
            $map: {
              input: "$bloodDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "blood",
                  },
                ],
              },
            },
          },
          dermaDetails: {
            $map: {
              input: "$dermaDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "derma",
                  },
                ],
              },
            },
          },
          screeningDetails: {
            $map: {
              input: "$screeningDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "screening",
                  },
                ],
              },
            },
          },
          corporateDetails: {
            $map: {
              input: "$corporateDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "corporate",
                  },
                ],
              },
            },
          },
          bloodreportsDetails: {
            $map: {
              input: "$bloodreportsDetails",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "Blood Result",
                  },
                ],
              },
            },
          },
          oldpatients: {
            $map: {
              input: "$oldpatients",
              as: "doc",
              in: {
                $mergeObjects: [
                  "$$doc",
                  {
                    clinic: "Old Data",
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          // Merge the results of all $lookup stages into a single array field
          allbookings: {
            $concatArrays: [
              "$pcrDetails",
              "$gynaeDetails",
              "$gpDetails",
              "$stdDetails",
              "$bloodDetails",
              "$dermaDetails",
              "$screeningDetails",
              "$corporateDetails",
              "$bloodreportsDetails",
              "$oldPatientsDetails",
            ],
            // Add more $lookup arrays as needed
          },
          _id: 1,
          title: 1,
          forename: 1,
          surname: 1,
          fullname: 1,
          timeStamp: 1,
          phone: 1,
          postCode: 1,
          passportNumber: 1,
          birthDate: 1,
          gender: 1,
          patientId: 1,
        },
      },
      {
        $addFields: {
          bookings: {
            $sortArray: { input: "$allbookings", sortBy: { timeStamp: -1 } },
          },
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

router.post("/oldsearch", async function (req, res, next) {
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
            { $addFields: { fullname: "$name", bookingDate: "$testDate" } },
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
            {
              $addFields: { clinic: "Old Data" },
            },
          ],
        },
      },
      {
        $addFields: {
          birthDate: {
            $cond: {
              if: {
                $and: [
                  {
                    $eq: [
                      {
                        $type: "$birthDate",
                      },
                      "string",
                    ],
                  },
                  {
                    $regexMatch: {
                      input: "$birthDate",
                      regex: ".*T.*",
                    },
                  },
                ],
              },
              then: null,
              else: {
                $cond: {
                  if: {
                    $eq: [
                      {
                        $type: {
                          $dateFromString: {
                            dateString: "$birthDate",
                            format: "%Y-%m-%d",
                          },
                        },
                      },
                      "date",
                    ],
                  },
                  then: {
                    $dateFromString: {
                      dateString: "$birthDate",
                      format: "%Y-%m-%d",
                    },
                  },
                  else: null,
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
          allbookings: {
            $addToSet: "$$ROOT",
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
        $addFields: {
          bookings: {
            $sortArray: { input: "$allbookings", sortBy: { timeStamp: -1 } },
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
      {
        $addFields: {
          _id: {
            $concat: [
              {
                $toString: {
                  $trunc: { $multiply: [{ $rand: {} }, 100000000] },
                },
              },
            ],
          },
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

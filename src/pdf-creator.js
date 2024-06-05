const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

const { Booking } = require("./models/Booking");
const { GynaeBooking } = require("./models/gynae/GynaeBooking");
const { GPBooking } = require("./models/gp/GPBooking");
const {
  PaediatricianBooking,
} = require("./models/paediatrician/PaediatricianBooking");
const { STDBooking } = require("./models/std/STDBooking");
const { Invoice } = require("./models/medex/Invoice");

const dateformat = require("dateformat");
const {BloodBooking} = require("./models/blood/BloodBooking");
const {DermaBooking} = require("./models/derma/DermaBooking");
const {ScreeningBooking} = require("./models/screening/ScreeningBooking");
const {CorporateBooking} = require("./models/corporate/CorporateBooking");


function NormalizeDate(date) {
  return `${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`;
}

function NormalizeAddress(address) {
  return address.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ");
}

const createPDFForCovid1Form = async (id) => {
  try {
    const booking = await Booking.findOne({ _id: id });

    booking.birthDate = NormalizeDate(booking.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    booking.address = NormalizeAddress(booking.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/covid-form1.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(booking.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    ///check boxes
    booking.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    booking.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    booking.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here
    if (booking.passportNumber && booking.passportNumber.length > 0) {
      doc
        .fillColor("black")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("PASSPORT NUMBER: ", 20, 530, {
          characterSpacing: 0.5,
          wordSpacing: 1,
          lineGap: 2,
        });

      var passportStr = booking.passportNumber.toUpperCase();

      if (booking.passportNumber2 && booking.passportNumber2.length > 0) {
        passportStr += ` - ${booking.passportNumber2.toUpperCase()}`;
      }

      doc
        .fillColor("black")
        .fontSize(12)
        .font("Courier-Bold")
        .text(passportStr, 140, 529, {
          characterSpacing: 2,
          wordSpacing: 2,
          lineGap: 2,
        });
    }

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createPDFForCovid2Form = async (id) => {
  try {
    const booking = await Booking.findOne({ _id: id });

    const age =
      parseInt(new Date().getFullYear()) -
      parseInt(booking.birthDate.substr(0, 4));

    booking.birthDate = NormalizeDate(booking.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    booking.address = NormalizeAddress(booking.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/covid-form2.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "top",
    });

    if (booking.tr) {
      doc
        .fillColor("black")
        .fontSize(12)
        .font("Courier-Bold")
        .text("TR", 570, 15, {
          characterSpacing: 0.5,
          wordSpacing: 0.8,
          lineGap: 2,
        });
    } else {
      if (booking.certificate) {
        doc
          .fillColor("black")
          .fontSize(12)
          .font("Courier-Bold")
          .text("C", 570, 15, {
            characterSpacing: 0.8,
            wordSpacing: 0.8,
            lineGap: 2,
          });
      }
      if (booking.antiBodyTest) {
        doc
          .fillColor("black")
          .fontSize(12)
          .font("Courier-Bold")
          .text("A", 570, 28, {
            characterSpacing: 0.8,
            wordSpacing: 0.8,
            lineGap: 2,
          });
      }
    }

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.extRef, 150, 78, {
        characterSpacing: 2,
        wordSpacing: 8,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.surname.toUpperCase(), 100, 95, {
        characterSpacing: 4,
        wordSpacing: 8,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.title.toUpperCase(), 370, 94, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.forename.toUpperCase(), 100, 112, {
        characterSpacing: 4,
        wordSpacing: 8,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Courier-Bold")
      .text(booking.birthDate, 33, 150, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(10)
      .font("Courier-Bold")
      .text(`${age}`, 158, 150, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Courier-Bold")
      .text(booking.bookingDate, 336, 150, {
        characterSpacing: 0.8,
        wordSpacing: 1,
        lineGap: 2,
      });

    ///check boxes
    booking.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 230, 149, { scale: 0.6 })
      : doc.image("assets/checkbox.jpg", 230, 149, { scale: 0.6 });

    booking.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 293, 149, { scale: 0.6 })
      : doc.image("assets/checkbox.jpg", 293, 149, { scale: 0.6 });

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// const createRefNumber = (booking) =>
// {
//     const refNumber = `${booking.bookingRef.substr(0,3)}${booking.bookingRef.substr(4,3)}${booking.bookingRef.substr(8,3)}`;
//     const day = booking.birthDate.substr(0,2);
//     const month = booking.birthDate.substr(3,2);
//     return `MX${refNumber}${day}${month}`;
// }

const createPDFForGynaeRegistration = async (id) => {
  try {
    const booking = await GynaeBooking.findOne({ _id: id });

    if (!booking || !booking.formData) return;

    const formData = JSON.parse(booking.formData);

    formData.birthDate = NormalizeDate(formData.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    formData.address = NormalizeAddress(formData.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/gynae-reg-form.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.attendReason.toUpperCase(), 105, 447, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    ///check boxes
    formData.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createPDFForGPRegistration = async (id) => {
  try {
    const booking = await GPBooking.findOne({ _id: id });

    if (!booking || !booking.formData) return;

    const formData = JSON.parse(booking.formData);

    formData.birthDate = NormalizeDate(formData.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    formData.address = NormalizeAddress(formData.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/gynae-reg-form.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.attendReason.toUpperCase(), 105, 447, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    ///check boxes
    formData.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};


const createPDFForPaediatricianRegistration = async (id) => {
  try {
    const booking = await PaediatricianBooking.findOne({ _id: id });

    if (!booking || !booking.formData) return;

    const formData = JSON.parse(booking.formData);

    formData.birthDate = NormalizeDate(formData.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    formData.address = NormalizeAddress(formData.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/gynae-reg-form.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.attendReason.toUpperCase(), 105, 447, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    ///check boxes
    formData.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};


const createPDFForSTDRegistration = async (id) => {
  try {
    const booking = await STDBooking.findOne({ _id: id });

    if (!booking || !booking.formData) return;

    const formData = JSON.parse(booking.formData);

    formData.birthDate = NormalizeDate(formData.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    formData.address = NormalizeAddress(formData.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/gynae-reg-form.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.attendReason.toUpperCase(), 105, 447, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    ///check boxes
    formData.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};


const createPDFForBloodRegistration = async (id) => {
  try {
    const booking = await BloodBooking.findOne({ _id: id });

    if (!booking || !booking.formData) return;

    const formData = JSON.parse(booking.formData);

    formData.birthDate = NormalizeDate(formData.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    formData.address = NormalizeAddress(formData.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/gynae-reg-form.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.attendReason.toUpperCase(), 105, 447, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    ///check boxes
    formData.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createPDFForDermaRegistration = async (id) => {
  try {
    const booking = await DermaBooking.findOne({ _id: id });

    if (!booking || !booking.formData) return;

    const formData = JSON.parse(booking.formData);

    formData.birthDate = NormalizeDate(formData.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    formData.address = NormalizeAddress(formData.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/gynae-reg-form.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.attendReason.toUpperCase(), 105, 447, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    ///check boxes
    formData.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createPDFForScreeningRegistration = async (id) => {
  try {
    const booking = await ScreeningBooking.findOne({ _id: id });

    if (!booking || !booking.formData) return;

    const formData = JSON.parse(booking.formData);

    formData.birthDate = NormalizeDate(formData.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    formData.address = NormalizeAddress(formData.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/gynae-reg-form.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.attendReason.toUpperCase(), 105, 447, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    ///check boxes
    formData.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};


const createPDFForCorporateRegistration = async (id) => {
  try {
    const booking = await CorporateBooking.findOne({ _id: id });

    if (!booking || !booking.formData) return;

    const formData = JSON.parse(booking.formData);

    formData.birthDate = NormalizeDate(formData.birthDate);
    booking.bookingDate = NormalizeDate(booking.bookingDate);
    formData.address = NormalizeAddress(formData.address);

    const doc = new PDFDocument();
    //const stream = fs.createWriteStream(filePath);
    //doc.pipe(stream);
    doc.image("assets/gynae-reg-form.png", 0, 0, {
      fit: [590, 720],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.surname.toUpperCase(), 100, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.birthDate.toUpperCase(), 360, 187, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.forename.toUpperCase(), 100, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.title.toUpperCase(), 305, 215, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.address.toUpperCase(), 100, 245, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(formData.postCode.toUpperCase(), 100, 272, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.email.toUpperCase(), 290, 272, {
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.phone.toUpperCase(), 100, 300, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(12)
      .font("Courier-Bold")
      .text(booking.bookingDate, 360, 313, {
        characterSpacing: 2,
        wordSpacing: 2,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(9)
      .font("Courier-Bold")
      .text(formData.attendReason.toUpperCase(), 105, 447, {
        width: 480,
        characterSpacing: 0.5,
        wordSpacing: 0.5,
        lineGap: 1,
      });

    ///check boxes
    formData.gender.toLowerCase() === "male"
      ? doc.image("assets/checkbox-tick.jpg", 390, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 390, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "female"
      ? doc.image("assets/checkbox-tick.jpg", 452, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 452, 213, { scale: 0.55 });

    formData.gender.toLowerCase() === "other"
      ? doc.image("assets/checkbox-tick.jpg", 510, 213, { scale: 0.55 })
      : doc.image("assets/checkbox.jpg", 510, 213, { scale: 0.55 });

    /// passport here

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};






const createPDFForInvoice = async (id) => {
  try {
    const invoice = await Invoice.findOne({ _id: id });

    if (!invoice) return;

    const doc = new PDFDocument();

    const startX = 80;
    const startY = 70;

    // invoice.name = "MISS. TAYRAN DUFOUR";
    // invoice.address = "142 BARKAR DRIVE";
    // invoice.postCode = "NW10JE";

    doc.image("assets/certificate-template.png", 0, 0, {
      fit: [615, 800],
      align: "center",
      valign: "top",
    });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Times-Bold")
      .text(`INVOICE / RECEIPTS`, 0, startY + 40, {
        width: 615,
        align: "center",
        characterSpacing: 0.8,
        wordSpacing: 1,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Times-Bold")
      .text(`${ invoice.corporate ? invoice.corporate.toUpperCase() : invoice.name.toUpperCase()}`, startX, startY + 80, {
        width: 615,
        align: "left",
        characterSpacing: 0.8,
        wordSpacing: 1,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(
        `${ invoice.corporateAddress ? invoice.corporateAddress : invoice.address ? invoice.address.toUpperCase() : ""}`,
        startX,
        startY + 100,
        {
          width: 300,
          align: "left",
          characterSpacing: 0.8,
          wordSpacing: 1,
          lineGap: 2,
        }
      );

      doc.moveDown(0.3)
    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(
        `${
          invoice.corporateAddress ? '' : invoice.postCode
            ? invoice.postCode.toUpperCase()
            : ""
        }`,
        // startX,
        // startY + 115,
        {
          width: 615,
          align: "left",
          characterSpacing: 0.8,
          wordSpacing: 1,
          lineGap: 2,
        }
      );

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(
        `DATE: ${dateformat(invoice.date, "dd/mm/yyyy")}`,
        startX + 350,
        startY + 100,
        { align: "left", characterSpacing: 0.8, wordSpacing: 1, lineGap: 2 }
      );

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(`Name of Patient: ${invoice.name.toUpperCase()}`, startX, startY + 160, {
        width: 615,
        align: "left",
        characterSpacing: 0.8,
        wordSpacing: 1,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(`Date Attended:`, startX, startY + 180, {
        width: 615,
        align: "left",
        characterSpacing: 0.8,
        wordSpacing: 1,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(
        `${dateformat(invoice.dateAttended, "dd mmmm yyyy")}`,
        startX + 90,
        startY + 180,
        {
          width: 615,
          align: "left",
          characterSpacing: 0.8,
          wordSpacing: 1,
          lineGap: 2,
        }
      );

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(`Invoice Number:`, startX, startY + 230, {
        width: 615,
        align: "left",
        characterSpacing: 0.8,
        wordSpacing: 1,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(`${invoice.invoiceNumber}`, startX + 90, startY + 230, {
        width: 615,
        align: "left",
        characterSpacing: 0.8,
        wordSpacing: 1,
        lineGap: 2,
      });

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(`For professional services rendered for`, startX, startY + 250, {
        width: 615,
        align: "left",
        characterSpacing: 0.8,
        wordSpacing: 1,
        lineGap: 2,
      });
    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(
        `${dateformat(invoice.date, "dd mmmm yyyy")}`,
        startX + 210,
        startY + 250,
        {
          width: 615,
          align: "left",
          characterSpacing: 0.8,
          wordSpacing: 1,
          lineGap: 2,
        }
      );

    doc
      .fillColor("black")
      .fontSize(12)
      .font("Times-Bold")
      .text(
        `${invoice.grandTotal.toLocaleString("en-GB", {
          style: "currency",
          currency: "GBP",
        })}`,
        startX + 400,
        startY + 250,
        {
          width: 615,
          align: "left",
          characterSpacing: 0.8,
          wordSpacing: 1,
          lineGap: 2,
        }
      );

    let pageNumber = 1
    doc.on("pageAdded", () => {
      pageNumber++;
      doc.image("assets/certificate-template.png", 0, 0, {
        fit: [615, 800],
        align: "center",
        valign: "top",
      });
    });

    if (invoice.notes && invoice.notes.trim().length > 0)
    {
        invoice.items.push({
            description: `notes$:_${invoice.notes}`,
            price: invoice.grandTotal,
          });
    }

    invoice.items.push({
      description: "Grand Total",
      price: invoice.grandTotal,
    });

    let item_startY = 340;
    invoice.items.forEach((item) => {
      item_startY += 30;

      if (item_startY > 650) {
        doc
          .fillColor("#777")
          .fontSize(8)
          .font("Courier")
          .text(`Page 1 of 2`, 0, 700, {
            width: 615,
            align: "center",
            characterSpacing: 0.8,
            wordSpacing: 1,
            lineGap: 2,
          });
        doc.addPage();
        doc
          .fillColor("#777")
          .fontSize(8)
          .font("Courier")
          .text(`Page 2 of 2`, 0, 700, {
            width: 615,
            align: "center",
            characterSpacing: 0.8,
            wordSpacing: 1,
            lineGap: 2,
          });

        item_startY -= 500;
      }

      if (item.description.indexOf('notes$:_') === 0)
      {
        doc
          .fillColor("black")
          .fontSize(8)
          .font("Times-Bold")
          .text(`${item.description.substr(8)}`, startX, item_startY, {
            width: 480,
            align: "left",
            characterSpacing: 0.8,
            wordSpacing: 1,
            lineGap: 1,
          })
         ;
      }
      else
      {
        let fontSize = 9;
        let font = "Courier";
        if (item.description === "Grand Total") {
          font = "Courier-Bold";
          fontSize = 12;
          doc.rect(startX, item_startY - 10, 470, 30).stroke();
        }
  
        doc
          .fillColor("black")
          .fontSize(fontSize)
          .font(font)
          .text(`${item.description}`, startX + 10, item_startY, {
            width: 370,
            align: "left",
            characterSpacing: 0.5,
            wordSpacing: 0.5,
            lineGap: 2,
          });
  
        doc
          .fillColor("black")
          .fontSize(fontSize)
          .font("Courier-Bold")
          .text(
            `${parseFloat(item.price).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}`,
            startX + 350,
            item_startY,
            {
              width: 100,
              align: "right",
              characterSpacing: 0.5,
              wordSpacing: 0.5,
              lineGap: 2,
            }
          );
      }

    });

    item_startY += 70;

    if (item_startY > 650) {
      doc
        .fillColor("#777")
        .fontSize(8)
        .font("Courier")
        .text(`Page 1 of 2`, 0, 700, {
          width: 615,
          align: "center",
          characterSpacing: 0.8,
          wordSpacing: 1,
          lineGap: 2,
        });
      doc.addPage();
      doc
        .fillColor("#777")
        .fontSize(8)
        .font("Courier")
        .text(`Page 2 of 2`, 0, 700, {
          width: 615,
          align: "center",
          characterSpacing: 0.8,
          wordSpacing: 1,
          lineGap: 2,
        });
      item_startY -= 500;
    }

    doc
      .fillColor("black")
      .fontSize(10)
      .font("Times-Bold")
      .text(
        `All cheques should be payable to Medical Express Clinic. Alternatively if you pay by standing order or BACS-Sort Code 30-00-09   Acount No: 00916719`,
        startX,
        item_startY,
        {
          width: 480,
          align: "left",
          characterSpacing: 0.8,
          wordSpacing: 1,
          lineGap: 7,
        }
      );

    doc.end();
    return await getStream.buffer(doc);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  createPDFForCovid1Form: createPDFForCovid1Form,
  createPDFForCovid2Form: createPDFForCovid2Form,
  createPDFForGynaeRegistration: createPDFForGynaeRegistration,
  createPDFForGPRegistration: createPDFForGPRegistration,
  createPDFForPaediatricianRegistration: createPDFForPaediatricianRegistration,
  createPDFForSTDRegistration: createPDFForSTDRegistration,
  createPDFForBloodRegistration: createPDFForBloodRegistration,
  createPDFForInvoice: createPDFForInvoice,
  createPDFForDermaRegistration: createPDFForDermaRegistration,
  createPDFForScreeningRegistration: createPDFForScreeningRegistration,
};

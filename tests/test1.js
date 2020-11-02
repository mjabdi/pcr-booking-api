const mongodb = require('./../src/mongodb');
const {createPDFForCovid1Form, createPDFForCovid2Form} = require('./../src/pdf-creator'); 
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

(async ()=>
{
    await mongodb();

     await createPDFForCovid1Form( ObjectId('5f9e7580cdcd3205304f3522') , 'd:/sample-covid-form1.pdf');
    //await createPDFForCovid2Form( ObjectId('5f9e7580cdcd3205304f3522') , 'd:/sample-covid-form2.pdf');
   
    console.log('yohooooooo');

})();
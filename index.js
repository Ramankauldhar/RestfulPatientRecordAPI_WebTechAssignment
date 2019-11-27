var SERVER_NAME = 'patient-api'
var PORT = process.env.PORT;


var restify = require('restify');
var errors = require('restify-errors');

var save = require('save')

var patientsSave = save('patient')
var recordsSave = save('records')

var server = restify.createServer();

// configure request body parser
server.use(restify.plugins.bodyParser({ mapParams: false }));

// starting server
server.listen(3008, function() {
    //to log the information on start-up about server url
    console.log('%s listening at %s', server.name, server.url);
    console.log('Endpoints:')
    console.log('%s/products method: GET, POST, GET by id,DELETE', server.url)
});


//ADD patient (by post request)
server.post('/patients', addNewPatient);

//ADD patient record (by post request)
server.post('/patients/:id/records', addNewPatientRecord);

//List all patients (by get request)
server.get('/patients', getAllPatients);


//View patient by id (by get request)
server.get('/patients/:id', getPatientsById);


//View patientRecord by id (by get request)
server.get('/patients/:id/records', getPatientsRecord);

//delete patient (by delete request)
server.del('/patients', deleteAllPatients);

//delete record (by delete request)
server.del('/patients/:id/records', deleteAllRecords);

//delete record by id (by delete request)
server.del('/patients/:id/records/:id', deleteRecordsbyId);

//delete patient (by delete request)
server.del('/patients/:id', deletePatientsbyId);

//update patient
server.put('/patients/:id', changePatientDetailsById);


// callback function mapped to POST request
function addNewPatient(req, res, next) {
    console.log("sending request to add a patient")

    if (req.body.first_name === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('First Name is required'))
    }
    if (req.body.last_name === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Last Name is required'))
    }
    if (req.body.address === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Address is required'))
    }
    if (req.body.date_of_birth === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Date of birth is required'))
    }
    if (req.body.department === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Department is required'))
    }
    if (req.body.doctor === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Doctor name is required'))
    }
    // json payload of the request
    var newPatient = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        date_of_birth: req.body.dateOfBirth,
        department: req.body.department,
        doctor: req.body.doctor
    }
    patientsSave.create(newPatient, function(error, patient) {
        console.log("Created new patient")
            //If there are any errors, pass them to next in the correct format
        if (error) return next(new errors.InvalidArgumentError(JSON.stringify(error.errors)))
            // send 201 HTTP response code and created patient object
        res.send(201, patient);
        next();
    })
}


// callback function mapped to POST request
function addNewPatientRecord(req, res, next) {
    console.log("sending request to add record of patient")

    if (req.body.date === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Date is required'))
    }
    if (req.body.nurse_name === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Nurse Name is required'))
    }
    if (req.body.type === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Type is required'))
    }
    if (req.body.category === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Category is required'))
    }
    // json payload of the request
    var newPatientRecord = {
        patientid: req.params.id,
        date: req.body.date,
        nurse_name: req.body.nurse_name,
        type: req.body.type,
        category: req.body.category
    }

    recordsSave.create(newPatientRecord, function(error, patientRecord) {
        console.log("Created new patient record")
        if (error) return next(new errors.InvalidArgumentError(JSON.stringify(error.errors)))
            // send 201 HTTP response code and created patient object
        res.send(201, patientRecord);
        next();
    })
}


function getPatientsRecord(req, res, next) {
    console.log("sending request to get all patients record")
    recordsSave.find({}, function(error, foundPatientsRecord) {
        console.log('error is :' + error)
            // send 200 HTTP response code and array of found patients record
        res.send(200, foundPatientsRecord);
        console.log("received all patients records");
        next();
    })
}

// callback function mapped to GET request
function getAllPatients(req, res, next) {
    console.log("sending request to get all patients")
    patientsSave.find({}, null, function(err, foundPatients) {
        // send 200 HTTP response code and array of found patients
        res.send(200, foundPatients);
        console.log("received all patients");
        next();
    })
}

// get patient by id
function getPatientsById(req, res, next) {
    console.log('sending request to get patient by id')
    patientsSave.find({ _id: req.params.id }, function(error, foundPatients) {
        // send 200 HTTP response code and found patients
        console.log('error is :' + error)
        res.send(200, foundPatients);
        console.log("received patient by id");
        next();
    })
}


// callback function mapped to DELETE request
function  deleteAllPatients(req,  res,  next)  {    
    console.log("Deleting all patients");    
    patientsSave.deleteMany({},  function(err, Patients) {        
        console.log("error" +  err);
        console.log("Deleted patients")         // send 200 HTTP response code 
                     res.send(200, Patients);        
        next();    
    })
}

function  deleteAllRecords(req,  res,  next)  {    
    console.log("Deleting all record");    
    recordsSave.deleteMany({},  function(err, records) {        
        console.log("error" +  err);
        console.log("Deleted patients")         // send 200 HTTP response code 
                     res.send(200, records);        
        next();    
    })
}

function  deleteRecordsbyId(req,  res,  next)  {    
    console.log("Deleting  record");    
    recordsSave.delete(req.params.id,  function(err, recordsid) {        
        console.log("error" +  err);
        console.log("Deleted patients")         // send 200 HTTP response code 
                     res.send(200, recordsid);        
        next();    
    })
}
// callback function mapped to DELETE request
function  deletePatientsbyId(req,  res,  next)  {    
    console.log("Deleting patients");    
    patientsSave.delete(req.params.id,  function(err, Patients) {      
        console.log("Deleted patients")         // send 200 HTTP response code 
                     res.send(200, Patients);        
        next();    
    })
}

function changePatientDetailsById(req, res, next) {

    if (req.body.first_name === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('First Name is required'))
    }
    if (req.body.last_name === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Last Name is required'))
    }
    if (req.body.address === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Address is required'))
    }
    if (req.body.date_of_birth === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Date of birth is required'))
    }
    if (req.body.department === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Department is required'))
    }
    if (req.body.doctor === undefined) {
        //If there are any errors, pass them to next in the correct format
        return next(new errors.InvalidArgumentError('Doctor name is required'))
    }
    var changePatientData = {
        _id: req.params.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        date_of_birth: req.body.dateOfBirth,
        department: req.body.department,
        doctor: req.body.doctor
    }

    // Update the patients deatails with the persistence engine
    patientsSave.update(changePatientData, function(error, changedData) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new errors.InvalidArgumentError("Error"))

        console.log("Record changed of patient at id " + req.params.id)

        // Send a 200 OK response
        res.send(200, changedData)

        next();
    })
}
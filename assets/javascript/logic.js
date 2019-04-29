// Initialize Firebase
var config = {
    apiKey: "AIzaSyDMQ-3DJ8-9x-v1Etwu_XC_K0owvfE2mfw",
    authDomain: "hw7-train-schedule-d5272.firebaseapp.com",
    databaseURL: "https://hw7-train-schedule-d5272.firebaseio.com",
    projectId: "hw7-train-schedule-d5272",
    storageBucket: "hw7-train-schedule-d5272.appspot.com",
    messagingSenderId: "1080144134307"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

//Run Time  
setInterval(function (startTime) {
    $("#timer").html(moment().format('hh:mm a'))
}, 1000);

// Capture Button Click
$("#add-train").on("click", function () {
    // Don't refresh the page!
    event.preventDefault();

    // Code in the logic for storing and retrieving the most recent train information
    var train = $("#trainname-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var firstTime = $("#firsttime-input").val().trim();

    // here we push dada to our firebase
    database.ref().push({
        formtrain: train,
        formdestination: destination,
        formfrequency: frequency,
        formfirsttime: firstTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    console.log(trainInfo.formtrain);
    console.log(trainInfo.formdestination);
    console.log(trainInfo.formfrequency);
    console.log(trainInfo.formfirsttime);
    console.log(trainInfo.dateAdded);

    // Alert
    // alert("Train was successfully added");

    // Clears all of the text-boxes
    $("#trainname-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#firsttime-input").val("");

});
// Firebase watcher + initial loader 
database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    var train = childSnapshot.val().formtrain;
    var destination = childSnapshot.val().formdestination;
    var frequency = childSnapshot.val().formfrequency;
    var firstTime = childSnapshot.val().formfirsttime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

    //determine Current Time
    var currentTime = moment();

    //get timer functioning
    $("#timer").text(currentTime.format("hh:mm a"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;

    //determine Minutes Away
    var minutesAway = frequency - tRemainder;

    //determine Next Train Arrival
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");


    //want to push to table to add new train 
    //add new table row
    //add new train information into row
    // Add each train's data into the table row

    //adds back updated information
    $("#train-table > tbody").append("<tr>" + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td>");

    // var t = setTimeout(startTime, 500);

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});



//I want to update time of minutesAway and nextArrival 
//I am not sure how to call the previous function and use the setInterval or setTimeout to update the time in that function, so once each train is called and time passes then this function empties the table body and pulls each train and redoes the math
// Update minutes away by triggering change in firebase children
function timeUpdater() {
    //empty tbody before appending new information
    $("#train-table > tbody").empty();
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        var train = childSnapshot.val().formtrain;
        var destination = childSnapshot.val().formdestination;
        var frequency = childSnapshot.val().formfrequency;
        var firstTime = childSnapshot.val().formfirsttime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();
        // $("#timer").html(h + ":" + m);
        $("#timer").text(currentTime.format("hh:mm a"));
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;

        //determine Minutes Away
        var minutesAway = frequency - tRemainder;

        //determine Next Train Arrival
        var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

        //want to push to table to add new train 
        //add new table row
        //add new train information into row
        // Add each train's data into the table row
        $("#train-table > tbody").append("<tr>" + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
            frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</tr>");

    })
};
setInterval(timeUpdater, 6000);
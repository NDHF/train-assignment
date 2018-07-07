//Time values
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function currentTimeInMinutes() {

    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();

    return ((h * 60) + m);
};

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCasO5gBQiGYvI7eOHhgXcslliDvSe1p9M",
    authDomain: "njb-train-schedule-db.firebaseapp.com",
    databaseURL: "https://njb-train-schedule-db.firebaseio.com",
    projectId: "njb-train-schedule-db",
    storageBucket: "njb-train-schedule-db.appspot.com",
    messagingSenderId: "834544510804"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

// * Train Name

// * Destination 

// * First Train Time in military time

// * Frequency in minutes

// * Code this app to calculate when the next train will arrive; this should be relative to the current time.

// Initial Values
var trainName = "";
var trainNumber = "";
var destination = "";
var firstTrainTime = 0;
var status = "";
var gateTrack = "";
var frequency = "";

//Formula for calculating the next train
var nextTrain = frequency - ((currentTimeInMinutes() - firstTrainTime) % frequency);

function clock() {

    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();

    if (m < 10) {
        m = "0" + m;
    }

    if (h === 0) {
        $("#timeDivHeader").html("12:" + m + " a");
    } else if (h < 12) {
        $("#timeDivHeader").html(h + ":" + m + " a");
    } else if (h > 12) {
        $("#timeDivHeader").html((h - 12) + ":" + m + " p");
    } else if (h === 12) {
        $("#timeDivHeader").html(h + ":" + m + " p");
    } else {
        console.error("this should never happen");
    }


    $("#currentDateHeader").html(DAYS[d.getDay()] + " " + MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear());

};

clock();
setInterval(clock, 1000);

var counter = 0;

$("#submitButton").on("click", function (event) {

    counter++;

    event.preventDefault();

    trainName = $("#trainNameInput").val().trim();
    console.log(trainName);
    trainNumber = $("#trainNumberInput").val().trim();
    console.log(trainNumber);
    destination = $("#destinationInput").val().trim();
    console.log(destination);
    firstTrainTime = $("#firstTrainTimeInput").val().trim();
    console.log(firstTrainTime);
    status = $("#statusInput").val().trim();
    console.log(status);
    gateTrack = $("#gateTrackInput").val().trim();
    console.log(gateTrack);
    frequency = $("#trainFrequencyInput").val().trim();
    console.log(frequency);

    dataRef.ref().push({

        objectNumber: counter,
        trainName: trainName,
        trainNumber: trainNumber,
        destination: destination,
        firstTrainTime: firstTrainTime,
        status: status,
        gateTrack: gateTrack,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

var trainScheduleRows = [];

function updateSchedule(childSnapshot) {

    // console.log("Hi!");

    // console.log(childSnapshot.val().trainName);
    // console.log(childSnapshot.val().trainNumber);
    // console.log(childSnapshot.val().destination);
    // console.log(childSnapshot.val().firstTrainTime);
    // console.log(childSnapshot.val().status);
    // console.log(childSnapshot.val().gateTrack);
    // console.log(childSnapshot.val().frequency);

    $("#trainScheduleTable").append(
        "<tr class='dataRow'>" +
        "<td>" + (childSnapshot.val().frequency - ((currentTimeInMinutes() - childSnapshot.val().firstTrainTime) % childSnapshot.val().frequency)) + " min." + "</td>" +
        "<td>" + childSnapshot.val().trainNumber + "</td>" +
        "<td>" + childSnapshot.val().trainName + "</td>" +
        "<td>" + childSnapshot.val().destination + "</td>" +
        "<td>" + childSnapshot.val().status + "</td>" +
        "<td>" + childSnapshot.val().gateTrack + "</td>" +
        "</tr>");
}

setInterval( function () {
    $("#trainScheduleTable tr:not(#trainScheduleTableHeaderRow)").remove();

    trainScheduleRows.forEach(updateSchedule);

}, 1000);

dataRef.ref().on("child_added", function (childSnapshot) {

    trainScheduleRows.push(childSnapshot);
    updateSchedule(childSnapshot);

}, function (errorObject) {

    console.log("Errors handled: " + errorObject.code);
});
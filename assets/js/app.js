// PTR: Parking Ticket Reimbursment App
// Project #1. UM Coding Boot CAmp 2018.

//Global Variables
var userLoginBtn = '#'; // Id of the User login button
var adminLoginBtn = '#'; //Id of the Admin login button

var fbDatabaseName = 'ptrdb-jld03e';

$(document).ready( function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBcDa7GD5WZ6M3CYC9l40e7RLgAdI2d3Es", //updaed by Jose
        authDomain: fbDatabaseName + ".firebaseapp.com",
        databaseURL: "https://ptrdb-jld03e.firebaseio.com",
        projectId: fbDatabaseName,
        storageBucket: fbDatabaseName + ".appspot.com",
        messagingSenderId: "226505053419" //updated by Jose.
    };
    firebase.initializeApp(config);

    //Reference to ptrdb database
    var fbptrDB = firebase.database();
    console.log( fbptrDB );

    //Retrieve Users
    fbptrDB.ref().on( "child_added", function( snapshot ) {
        //console.log( snapshot.val() );
        console.log( snapshot.val().Users );
    } );



});

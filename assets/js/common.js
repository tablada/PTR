//Global Variables

//Jose's firebase
//var fbdbName = 'ptrdb-jld033e';
//var fbapiKey = 'AIzaSyAArNZrUqHuAtUc1y1CmbHEm1ttPE-cRHM';
//var fbmsgSenderId = '494811335253' ;

//Joed's firebase
var fbdbName = 'mydatabase-d0ea4';
var fbapiKey = 'AIzaSyCAjzGrkukVsPrKTM2H_YhYt_tmkg2zmJs';
var fbmsgSenderId = '119065879861';

//Google API
var googleApiKey = "AIzaSyCL9pLI8qqXooLR6E5NvjK_qE0vT1oN6IY";

// Initialize Firebase
var config = {
    apiKey: fbapiKey,
    authDomain: fbdbName + ".firebaseapp.com",
    databaseURL: "https://" + fbdbName + ".firebaseio.com",
    projectId: fbdbName,
    storageBucket: fbdbName + ".appspot.com",
    messagingSenderId: fbmsgSenderId
};
firebase.initializeApp(config);

//reference to firebase database
fbPtrDb = firebase.database();
console.log( fbPtrDb );

//this function obtain the arguments passed in an url using the request methos GET
function getUrlArgs() {
    var args = {};
    var cuts = window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { args[key]= value;} );
    return args;
}

//start manipulating the DOM
$(document).ready( function(){

    $('.dropdown-trigger').dropdown();

    //Show the users in a user dropdown button
    fbPtrDb.ref('users/').on( "child_added", function( snapshot ) {

        var name = snapshot.val().userName;

        $('<li><a href="user.html?user='+name+'">' + name + '</a></li>').appendTo('#dropdown-button1');

    } );

});

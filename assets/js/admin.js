//Some Variables
var addUserBtnId = '#addUserBtn'; //add user button
var addPlaceBtnId = '#addPlaceBtn'; //add place button
var addTicketBtnId ='#addTicketBtn'; //add ticket button

var tbUsers ='#tbUsers'; //table body id where users are shown

//user form vars
var frmName = '#user_name';
var frmTitle = '#user_title';
var frmMake = '#user_carMake';
var frmModel = '#user_carModel';
var frmTag = '#user_carTag';

//Map variables
var adminGoogleMap;
var markers = [];
var bound;
var tmpMap;

//function tha manage the on click event for addUserBtn
function addUserBtnClick( e ) {
    e.preventDefault();
    console.log('addUser button clicked');

    //grab values from add user form and pass as value to the function addUser
    var name = $( frmName ).val().trim();
    var title = $( frmTitle ).val().trim();
    var make = $( frmMake ).val().trim();
    var model = $( frmModel ).val().trim();
    var tag = $( frmTag ).val().trim();

    addUser( name, title, {'make': make, 'model': model, 'tag': tag} );

    //clear inputs from form
    $( frmName ).val('');
    $( frmTitle ).val('');
    $( frmMake ).val('');
    $( frmModel ).val('');
    $( frmTag ).val('');
}

//function for adding users to database
function addUser( name, title, car ) {
    console.log('Adding user...');

    var user = {
        userName: name,
        userTitle: title,
        userCar: car,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    }

    fbPtrDb.ref('users/').push( user );

}

//function that manage the on click event for addPlaceBtn
function addPlaceBtnClick( e ) {
    e.preventDefault();
    console.log('addPlace button clicked');

    //grab values from add place form and pass as value to the function addPlace

    addPlace( 'UM', {'lat':'25.7230019', 'long':'-80.2784722'} );

    //clear inputs from form
}

//function for adding places to database
function addPlace( name, coordinates ) {
    console.log('Adding place...');

    var place = {
        placeName: name,
        placeCoordinates: coordinates //coordinates is an object {lat:value, long:value}
    }

    console.log( coordinates );

    fbPtrDb.ref('places/').push( place );
}



//managing oclick venet for get location button
function getLocationBtnClick() {
    console.log('getLocation Button clicked');
    getLocation();
}

//get location function
function getLocation( map ) {
    tmpMap = map; //tmpMap is a global variable to use as a parameter

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( showPosition, showError );
    }
    else {
        alert( "Geolocation is not supported by this browser." );
    }
}

//creating a map
function createMap( container ) {
    var myOptions = {
        //center: latlon,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        navigationControlOptions:{
            style: google.maps.NavigationControlStyle.SMALL
        }
    }

    var map = new google.maps.Map( container, myOptions );
    return map
}

//show position on a map
function showPosition( position ) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var latlon = new google.maps.LatLng( lat, lon );
    console.log('var latlon created');

    //centering the map
    tmpMap.setCenter( latlon );

    //adding marker for signaling where you are
    var marker = new google.maps.Marker({
        position: latlon,
        map: tmpMap, //map,
        title: 'You are here',
        animation: google.maps.Animation.BOUNCE
    })

    //show the markers for job sites
    if ( markers.length > 0 ) {
        for( var i=0; i< markers.length; i++ ){
            markers[i].setMap( tmpMap );
            bound.extend( markers[i].position );
        }
        bound.getCenter();
        tmpMap.fitBounds( bound );
        //map.fitBounds( bound );
    }

    tmpMap.addListener('click', function( e ) {
        console.log( e.latLng.lat() + ', ' + e.latLng.lng() );

        $('#addPlaceModal').modal( 'open' );

        $('#addPlaceModal').attr({
            lat: e.latLng.lat(),
            lon: e.latLng.lng()
        });

    } ); //end of the function listener


} //end of show position

//show errors on getting location
function showError( error ) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert( "User denied the request for Geolocation." )
            break;
        case error.POSITION_UNAVAILABLE:
            alert( "Location information is unavailable." )
            break;
        case error.TIMEOUT:
            alert( "The request to get user location timed out." )
            break;
        case error.UNKNOWN_ERROR:
            alert( "An unknown error occurred." )
            break;
    }
}

//A callback function that is called when a addPlaceModal dialog is closed
function addPlaceModalClose() {
    console.log( 'addPlaceModal is closed' );
    console.log( $('#addPlaceModal').attr('result') );
    if ( $('#addPlaceModal').attr('result') == 'ok' ) {
        var lat = $('#addPlaceModal').attr('lat');
        var lon = $('#addPlaceModal').attr('lon');
        var placeName = $('#placeNameModal').val();
        var latlon = new google.maps.LatLng( lat, lon );

        //Create and show marker
        var marker = new google.maps.Marker({
            position: latlon,
            map: tmpMap,
            title: placeName,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', //'assets/images/jobsite.png',
            animation: google.maps.Animation.DROP
        });

        marker.addListener('click', function() {
            //show popup menu to delete or edit a marker (place)
            console.log( this.tile );
        });

        //Adjust centering of the map
        bound.extend( latlon );
        bound.getCenter();
        tmpMap.fitBounds( bound );
        //map.fitBounds(bound);

        //Add values to Firebase
        addPlace( placeName, {'lat': lat, 'long': lon } );

    }
}

//A callback function that is called when a editPlaceModal dialog is closed
function editPlaceModalClose() {

}

//A callback function that is called when the dropdown button for selecting user is closed
function selectUserClose() {
    //console.log( $('#selectUserAdmin') );
}

/* ----------------------------------------------------------------------- */

//start manipulating the DOM
$(document).ready( function(){

    //materialize initializations
    //Tabs
    $('.tabs').tabs(); // for using tabs

    //MOdals
    $('.modal').modal(); //for using modals
    $('#addPlaceModal').modal( {
        onCloseEnd: addPlaceModalClose
    } ); //registering an onclose event for add place modal
    $('#editPlaceModal').modal(  {
        onCloseEnd: editPlaceModalClose
    } );

    //Dropdowns
    $('.dropdown-trigger').dropdown(); //for dropdowns
    $('#ddSelectUser').dropdown( {
        constrainWidth: false,
        coverTrigger: false
    } );
    $('#ddSelectUserAdmin').dropdown({
        constrainWidth: false,
        coverTrigger: false,
        onCloseEnd: selectUserClose
    });

    //grab DOM element to insert the map
    var adminMap = $('#adminMap');
    adminMap.css( { 'height':'600px', 'width':'100%' } );

    //create google map
    adminGoogleMap = createMap( adminMap[0] );

    //creates it for centering all the markers
    bound = new google.maps.LatLngBounds(); //bound is global

    //get current location and shows on map
    getLocation( adminGoogleMap );

    //Registering onclick event for adding user
    $( addUserBtnId ).click( addUserBtnClick );



    //Show the users in a table
    fbPtrDb.ref('users/').on( "child_added", function( snapshot ) {
        console.log( 'users.child_added: ' + snapshot.val().userName );

        var name = snapshot.val().userName;
        var title = snapshot.val().userTitle;
        var make = snapshot.val().userCar.make;
        var model = snapshot.val().userCar.model;
        var tag = snapshot.val().userCar.tag;

        var newRow = $('<tr>').appendTo( $( tbUsers ) );
        $('<td>').text( name ).appendTo( newRow );
        $('<td>').text( title ).appendTo( newRow );
        $('<td>').text( make ).appendTo( newRow );
        $('<td>').text( model ).appendTo( newRow );
        $('<td>').text( tag ).appendTo( newRow );

        //add users to a dropdown
        $('<li value="'+name+'"><a href="#!">' + name + '</a></li>').appendTo('#selectUserAdmin');

        //$('<option value="'+name+'">'+name+'</option>').appendTo('#selectUserAdmin');

    } );

    //Show the jobsites in map
    fbPtrDb.ref('places/').on( "child_added", function( snapshot ) {
        console.log( 'Place name = ' + snapshot.val().placeName + '('+ snapshot.val().placeCoordinates.lat +')');

        //adding marker
        var latlon = new google.maps.LatLng( snapshot.val().placeCoordinates.lat, snapshot.val().placeCoordinates.long );
        var marker = new google.maps.Marker({
            position: latlon,
            //map: adminGoogleMap,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            title: snapshot.val().placeName,
            animation: google.maps.Animation.DROP
        });

        //registering right click event for markers
        marker.addListener('rightclick', function() {
            console.log( this.title );
            //show a modal menu to delete or edit a marker (place)
            $('#placeEditModal').val( this.title );
            $('#editPlaceModal').modal( 'open' );
        });

        markers.push( marker );


    });


});

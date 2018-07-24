//Global variables
var userName = '';



//managing onclick event for addTicket button
function addTicketBtnClick( e ) {
    console.log( 'Add ticket button clicked' );

    //call modal dlg
    $('#addTicketModal').modal('open');

    //var now = moment().format('MM/DD/YYYY hh:mm a');

}


function addTicketModalBtnClick() {


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( function( position ) {

            var place = {
                name: $('#ticket_location').val(),
                coordinates: {'lat':position.coords.latitude, 'long':position.coords.longitude}
            }

            //read values from modal dlg
            var startDate = $('#ticket_startDate').val()+' '+$('#ticket_startTime').val();
            var stopDate = $('#ticket_stopDate').val()+' '+$('#ticket_stopTime').val();
            var rate = $('#ticket_rate').val();

            console.log(userName);
            console.log(startDate);
            console.log(stopDate);
            console.log(place);
            console.log(rate);

            addTicket( userName, startDate, stopDate, place, rate );

        });
    }
    else {
        alert( "Geolocation is not supported by this browser." );
    }

}

//function for adding ticket
function addTicket( userName, startDate, stopDate, place, rate ) {
    console.log('Adding ticket to user...');

    var ticket = {
        ticketStartDate: startDate,
        ticketStopDate: stopDate,
        ticketPlace: place,
        ticketRate: rate,         //obtain this value from parking API
        ticketAproved: 'false',
        ticketPreAproved: 'false'
    }


    fbPtrDb.ref( 'tickets/'+userName+'/' ).push( ticket );
}

/*---------------------------------------------------------------------------------*/

$(document).ready( function() {
    //extracting the parameter user
    userName = decodeURI( getUrlArgs()['user'] );

    //showing the user name
    $('#userName').html( '<strong>'+userName+'</strong>' );

    //Initializing modals from Materialize
    $('.modal').modal();

    $('.timepicker').timepicker();
    $('.datepicker').datepicker( {
        format: 'mm/dd/yyyy',
        container: $('#datetime-container')
    } );

    //Registering onclick event for adding ticket
    $('#addTicketId').click( addTicketBtnClick );

    //registering onclick event for modal button adding ticket
    $('#addTicketBtn').click( addTicketModalBtnClick );

    //Show the tickets in a table
    fbPtrDb.ref('tickets/'+userName+'/').on( "child_added", function( snapshot ) {
        console.log( 'tickets.child_added: ' );

        var startDate = snapshot.val().ticketStartDate;
        var stopDate = snapshot.val().ticketStopDate;
        var rate = snapshot.val().ticketRate;
        var aproved = snapshot.val().ticketAproved;
        var preAproved = snapshot.val().ticketPreAproved;
        var place = snapshot.val().ticketPlace;

        var totalHours = Math.abs( moment( startDate, 'MM/DD/YYYY hh:mm a' ).diff( moment( stopDate, 'MM/DD/YYYY hh:mm a' ), 'hours') );
        var status =''; // should be Aproved, Pre Aproved, Rejected, Standby

        var newRow = $('<tr>').appendTo( $( tbTickets ) );
        $('<td>').text( startDate ).appendTo( newRow );
        $('<td>').text( stopDate ).appendTo( newRow );
        $('<td>').text( place.name ).appendTo( newRow );
        $('<td>').text( rate ).appendTo( newRow );
        $('<td>').text( totalHours ).appendTo( newRow );
        $('<td>').text( status ).appendTo( newRow );

    } );

} );

  var notifications = [];
  var currentIntervalId = null;

  $(document).ready(function(){

    $("#vms #action").text("getting data...");
    /* get the notifications */
    $.get( "https://script.google.com/macros/s/AKfycbxOpg9sYSdlvVITtTOJSjfJxC8zG_DL4fMxgDPe676aSS4NZ2s/exec", function( data ) {
      /* keep only driver notifications */
      for (x = 0; x < data.length; x++){
        if (data[x].audience.toLowerCase() == "drivers") notifications.push(data[x]);
      }

      options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000*5
      };

      $("#vms #action").text("getting location");
      id = navigator.geolocation.watchPosition(show_active, error, options);

    });
  });

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  function show_active(position){

    $("#vms .inform").removeClass("hide");

    console.log(position);
    var currentDistance = 999;

    for (x = 0; x < notifications.length; x++){
      var note_distance = distance(position,notifications[x]);
      if (note_distance < currentDistance){
        currentDistance = note_distance;
        active_note = x;
      }
    }

    var active = notifications[active_note];
    $("#vms #location").text(transform(active.location)).addClass("hide");
    $('#vms #timing').text(transform(active.timing)).addClass("hide");
    $('#vms #whattoexpect').text(transform(active.whattoexpect)).addClass("hide");

    if (currentIntervalId!=null) clearInterval(currentIntervalId);

    currentIntervalId = setInterval( function()
    {
      $("#vms .inform").addClass("hide");
      if (!$("#vms #location").hasClass("hide")){
        $("#vms #location").addClass("hide");
        $("#vms #whattoexpect").removeClass("hide");

      } else if (!$("#vms #whattoexpect").hasClass("hide")) {
        $("#vms #whattoexpect").addClass("hide");
        $("#vms #timing").removeClass("hide");

      } else {
        $("#vms #timing").addClass("hide");
        $("#vms #location").removeClass("hide");
      }

    }, 3000);

  }

function distance(user_pos, notification) {
  var unit = "K";
  var lat1 = user_pos.coords.latitude;
  var lon1 = user_pos.coords.longitude;
  var lat2 = notification.latitude;
  var lon2 = notification.longitude;
  var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

function transform(the_text){

  the_text = the_text.toLowerCase();
  the_text = the_text.replace("-","to");
  the_text = the_text.replace("and","&");
  the_text = the_text.replace("freeway","fwy");
  the_text = the_text.replace("tullamarine","tulla");
  the_text = the_text.replace("street","st");
  the_text = the_text.replace("road","rd");
  the_text = the_text.replace("drive","dr");
  the_text = the_text.replace(",","");
  the_text = the_text.replace("  "," ");

  return the_text;

}

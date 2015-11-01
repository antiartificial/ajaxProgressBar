
$(document).ready(function() {
		
	/*$('.progressbar').each(function(){
		var t = $(this),
			dataperc = t.attr('data-perc'),
			barperc = Math.round(dataperc*5.56);
		t.find('.bar').animate({width:barperc}, dataperc*25);
		t.find('.label').append('<div class="perc"></div>');
		
		function perc() {
			var length = t.find('.bar').css('width'),
				perc = Math.round(parseInt(length)/5.56),
				labelpos = (parseInt(length)-2);
			t.find('.label').css('left', labelpos);
			t.find('.perc').text(perc+'%');
		}
		perc();
		setInterval(perc, 0); 
	});*/
	
	// Initialize to 0.
	var progValue = 0;
	var progMax = 100;
	var initialRun = true;
	
	// http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
	function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	// tokenize
	function splitValues(data) {
	  return data.split("/");
	}
	
	// set progress bar max value to whatever
	function setup(data) {
		// expected data format:
		// max/[0-9]/job/[a-zA-Z0-9]
		var maxJob = splitValues(data);
		
		if(maxJob[0] === "max") {
			progMax == maxJob[0];
			return progMax;
		}
		
		/*if(maxJob[2] === "job") {
			// todo
		}*/
		
		return false;
	}
	
	function updateProgress(newValue) {
		$('.progressbar').each(function(){
			var t = $(this),
				dataperc = newValue;//t.attr('data-perc'),
				barperc = Math.round(dataperc*5.56);
				
			
				t.find('.bar').animate({width:barperc}, dataperc*25);
				if(initialRun === true) {
					t.find('.label').append('<div class="perc"></div>');
				}
				
			function perc() {
				var length = t.find('.bar').css('width'),
					perc = Math.round(parseInt(length)/5.56),
					labelpos = (parseInt(length)-2);
				t.find('.label').css('left', labelpos);
				t.find('.perc').text(perc+'%');
			}
			perc();
			setInterval(perc, 0); 
		});
	}
	
	// See: http://www.htmlgoodies.com/beyond/javascript/providing-feedback-on-long-running-scripts-in-older-browsers.html
	//kick off the process
	$.ajax({
		url: 'long_process.php',         
		success: function(data) {
			// not getting anything returned from this :/
			/*console.log("Initialize: "+data);
			if(setup(data) != false) {
				console.log("Setup Progress Max Value: "+progMax)
			}*/
		},
		dataType: "json"
	});
	
	//start polling
	(function poll(){
	   setTimeout(function(){
		  $.ajax({
			 url: "get_progress.php",
			 success: function(data){
				//Update the progress bar
				//setProgress(data.value);
				if((isNumeric(data) === true)) {
					// only update if we get numbers
					console.log("Progress update: "+data);
					progValue = data;
					updateProgress(progValue);
				} else {
					// assume setup?
					
					if(setup(data) != false) {
						console.log("Progress Max Value: "+progMax)
					}
				}
 				
				//Setup the next poll recursively
				if(initialRun === false) {
					if(progValue < progMax) {
						poll();
					} else {
						// done
						updateProgress(progValue);
						console.log("Progress complete ["+progValue+"/"+progMax+"]");
					}
				} else {
					initialRun = false;
					poll();
				}
			 },
			 dataType: "json"
		 });
	  }, 2000);
	})();
});
$(document).ready(function() {
	var name = "Pgm1CL";

	// track id of the current checklist task (initialized later)
	var current;
	// track which spans have been clicked appropriately
	var clicked = [];
	// track which spans are needed for current question
	var waitingOn = [];


	/**
	 * returns the id of the next question, and rearranges class indicators
	 * if question is not provided, initialize the first question
	 */
	function advance(question) {
		var next;
		if(typeof(question)==='undefined') {
			next = name+"-list-var";				// first question
		} else {
			// check off question
			$("#"+question).prop('checked', true);


			// take focus away from current question
			$("#"+question+"-label").removeClass("si-checklist-active");


			switch(question) { // here's where flow is really controlled
			case name+"-list-var":		next = name+"-list-access";	break;
			case name+"-list-access":	next = name+"-list-modify";	break;
			default:	return;	// input invalid or question is complete
			}
		}

		// focus on next question
		$("#"+next+"-label").addClass("si-checklist-active");

		// track which spans are needed for next question
		waitingOn = [];
		$(".span-"+name).each(function(index) {
			if( $(this).hasClass(next+"-"+name) ) {
				waitingOn.push(index);
			}
		});

		return next;
	}


	current = advance();



	$(".span-"+name).each(function(index) {

		$(this).on('click', function() {
			span = $(this);

			// continue if user is currently supposed to click this span, and hasn't already
			if( span.hasClass(current+"-"+name) && $.inArray(index,clicked) < 0 ) {
				clicked.push(index);					// 		note that it's been clicked, programmatically
				span.addClass("si-code-clicked");		//		note that it's been clicked, graphically
				if(span.hasClass(name+"-list-modify-"+name)) {
					span.addClass("si-code-vulnerability"); //	some spans get extra graphics to indicate vulnerability
				}


				// Check if 'current' question is finished yet
				var finished = true;
				for(i in waitingOn) {
					finished &= $.inArray(waitingOn[i],clicked) >= 0;
				}
				// if it is, go to next question
				if(finished) current = advance(current);
			}
		});
	});
});

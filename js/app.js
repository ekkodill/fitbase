	//Calculate warmup weights
	function calcWarmup(off, number) {
	    var result = (off / 100) * number;
	    //document.getElementById(target).innerHTML = result;
	    return result;
	}


	//Store reps in Session localStorage
	$("#workout").on("click", "a.sets", function(e) {
	    var $this = $(this);
	    var current = Number($this.text());

		//	var start = 0;
	    var min = 4;
	    var med = 5;
	    var max = 6;
	    var reps = 0;
	    if (current == reps) {
	        current = min;
	    } else {
	        current++;
	    }
	    if (current > max) {
	        current = 0;
	    }
			if(current == max) {
			 $(this).removeClass('btn-info').addClass('btn-primary');
		 } else {
			 $(this).removeClass('btn-primary').addClass('btn-info');
		 }

	    var repid = $(this).attr("id");

	    sessionStorage.setItem(repid, current);
	    var txt = sessionStorage.getItem(repid);

	    $this.text(txt);
			return false;
	});

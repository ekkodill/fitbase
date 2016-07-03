var getRef = firebase.database().ref("exercises/");
var day;
var exDay = exName = exInfo = exImg = key = "";
var exWeight = 0;
var baseImg;
var exerciseData = {};

$(document).ready(function() {
	
	var $workout = $("#workout");
	var $exDetail = $("#exDetail");
	var $regForm = $("#regForm");




	function getWorkout(day) {
		$workout.show();
		var btnID = "";
		getRef.on('value', function(snap) {
			exerciseData = snap.val();
			var exPlan = "<table class='table table-bordered table-striped'><thead><tr><th>Exercise</th><th>Weight</th><th>Sets</th><th>Edit weight</th><th></td></thead><tbody>";
			$.each(exerciseData, function(index, value) {

				if (index && value.day == day) {  
				btnID = index;
		        //Reps for sets
		        var rep1 = "rep1"+index;
		        var rep2 = "rep3"+index;
		        var rep3 = "rep2"+index;
		        var rep1val = "0";
		        var rep2val = "0";
		        var rep3val = "0";
		        if(sessionStorage.getItem(rep1)) { rep1val = sessionStorage.getItem(rep1); }
		        if(sessionStorage.getItem(rep2)) { rep2val = sessionStorage.getItem(rep2); }
		        if(sessionStorage.getItem(rep3)) { rep3val = sessionStorage.getItem(rep3); }



		        exPlan += "<tr data-key=\""+index+"\"><td>"+value.name+"</td>";
		        exPlan += "<td class='two'>"+value.weight+"</td>";
		        exPlan += "<td class='col-sm-2'><a id='rep1"+index+"' type='button' class='btn btn-info btn-circle sets'>"+ rep1val +
		        "</a><a id='rep2"+index+"' type='button' class='btn btn-info btn-circle sets'>" + rep2val +
		        "</a> <a id='rep3"+index+"' type='button' class='btn btn-info btn-circle sets'>"+ rep3val + "</a></td>";

		        exPlan += "<td><a class=\"btn btn-success btn-circle inc\">+</a><a class=\"btn btn-default btn-circle dec\">-</a>" 
		        "</td>";        
		        exPlan += "<td><a class=\"btn btn-warning edit\">Edit</a> <a class=\"btn btn-danger delete\">Delete</a>  </td>";
		        exPlan +="</tr>";
		    }  
	
				

			});
			exPlan += "</tbody></table>";
			$("#main").html(exPlan);

		});

	}



//Display workout for selected day
$(".btnDay").on("click", function(e) {

	$("#"+day).css("color","black");
	day = this.id;

	$(this).css('color','red');
	$regForm.hide();
	getWorkout(day);
});

//Display Add \ edit form
$("#addEx").on("click", function(e) {
	$regForm.show();
});


   //Click on exercise to show info
   $("#workout").on("click", "td", function() {
   	var thisId = $(this).parent().data("key");

   	firebase.database().ref("exercises/"+thisId).on('value', function(snap) {
   		exInfo = snap.val();  
   		var firstSet = calcWarmup(50, exInfo.weight);
   		var thirdSet = calcWarmup(70, exInfo.weight);
   		var fourthSet = calcWarmup(90, exInfo.weight);
   		var pic = exInfo.img;
   		if(pic != "NONE") {
			var	pic = "<img src='"+exInfo.img+"' alt='Exercise demo'/>"
		}
   	
   		$exDetail.html("<h2>"+exInfo.name+"</h2><p>"+
   			exInfo.info+"</p><p>"+
   			exInfo.weight+" kg</p><p>"+
   			pic+
   			"</p><p>Oppvarming:</p><ol><li>"+firstSet+" kg</li>"+
   			"<li>"+firstSet+" kg</li>"+
   			"<li>"+thirdSet+" kg</li>"+
   			"<li>"+fourthSet+" kg</li></ol>"

   			).show();
   	});

   });


//Edit
$("#workout").on("click", "a.edit", function(e) {
    var thisId = $(this).parent().parent().data("key");

   	firebase.database().ref("exercises/"+thisId).on('value', function(snap) {
   		exInfo = snap.val();  
                    
         
        $("#key").val(thisId);
        $("#day").val(exInfo.day);
        $("#exercise").val(exInfo.name);
        $("#info").val(exInfo.info);
        $("#img").val(exInfo.img);
        $("#weight").val(exInfo.weight);
        $exDetail.hide();
        $regForm.show();
   	});
    return false;
});
 

var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
  } else {
        $("#key").val("");
        $("#day").val("");
        $("#exercise").val("");
        $("#info").val("");
        $("#img").val("");
        $("#weight").val("");
        getWorkout(day)
        $regForm.hide();

  }
};


function onDelComplete(error) {
	if(error) {
		alert('Delete failed');
	} else {
		getWorkout(day);
		$exDetail.hide();
		$regForm.hide();
	}
}

 //Delete
$("#workout").on("click", "a.delete", function(e) {
    var result = confirm("Are you sure?");
    if(result) {
    var thisId = $(this).parent().parent().data("key");
 		
 		getRef.child(thisId).remove(onDelComplete)
			 		
    }
    return false;
});


//Add or edit exercises
function addEx() {
	key = $("#key").val();
	exDay = $('#day').val();
	exName = $('#exercise').val();
	exInfo = $('#info').val();
	exImg = $('#img').val();
	exWeight = $('#weight').val();
	

	if(!exImg){
		exImg = 'NONE';
	}
	

	if(key === "") {
			getRef.push({
			day: exDay,
			name: exName,		
			info: exInfo,
			img: exImg,
			weight: exWeight
		},
			onComplete
		);
	} else {
		getRef.child(key).set({
			day: exDay,
			name: exName,		
			info: exInfo,
			img: exImg,
			weight: exWeight
		},
			onComplete
		);
	}
}


function clear() {
	$("#img").val("");
}

//Save exercises
 $('#saveBtn').click(addEx);

$('#clearImg').click(clear);

    //Update weight
    function updateW(id,option, cweight) {
  //   	        
		// 
        
        
    	var newweight = "";
        var xtraweight = 2.5;
        var oldweight = Number(cweight);   
                     
            if(option == "inc") {
                newweight = oldweight + xtraweight;
            } else {
                newweight = oldweight - xtraweight;
            }

        	var wRef = firebase.database().ref('exercises/'+id+'/');
			wRef.update({ weight : newweight });
			$regForm.hide();

    }


    //Add weight
    $("#workout").on("click", "a.inc", function(e) {
        var thisId = $(this).parent().parent().data("key");        
		var cWeight = $(this).closest('tr').find('td:eq(1)').text();
        updateW(thisId, "inc", cWeight);       
    });
    //Remove weight
        $("#workout").on("click", "a.dec", function(e) {
        var thisId = $(this).parent().parent().data("key");
        var cWeight = $(this).closest('tr').find('td:eq(1)').text();  
        updateW(thisId, "dec", cWeight);       
    });






});
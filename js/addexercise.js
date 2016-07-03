// var myRef = firebase.database().ref();

var exDay = exName = exInfo = exImg = key = "";
var exWeight = 0;
var baseImg;

$(document).ready(function() {

$('imageInput').change(function() {
	var reader = new FileReader();
	reader.onloadend = function() {
		baseImg = reader.result;
		$('#preview').attr('src', render.result);
	};
	reader.readAsDataUrl(this.files[0]);
});


$('#addForm').change(function(){
	exDay = $('#day').val();
	exName = $('#exercise').val();
	exInfo = $('#info').val();
	exImg = $('#img').val();
	exWeight = $('#weight').val();
//Check if all field holds value to unlock savebtn
	// if(exDay && exName && exInfo && exImg && exWeight) {
	// 	$('#saveBtn').removeProp('disabled');
	// } else {
	// 	$('saveBtn').prop('disabled', 'disabled');
	// }
});

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
	
	var exDB = myRef.child('exercises');
	if(key === "") {
			exDB.push({
			day: exDay,
			name: exName,		
			info: exInfo,
			img: exImg,
			weight: exWeight
		});
	} else {
		exDB.child(key).update({
			day: exDay,
			name: exName,		
			info: exInfo,
			img: exImg,
			weight: exWeight
		},
			onEditComplete
		);
	}
}

function onEditComplete(error) {
	if(error) {
		alert('update failed, error code: ' + error.code);
	} else {
		getWorkout(day);
		$exDetail.hide();
		$regForm.hide();
	}
}

 $('#saveBtn').click(addEx);


});
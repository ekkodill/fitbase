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

    var min = 4;
    var med = 5;
    var max = 6;
    var reps = 0;
    if(current == reps) {
        current = min;
    } else {
        current++;
    }
    if(current > max) {
        current = 4;
    }
    
    var test = $(this).attr("id");
    console.log(test);
    sessionStorage.setItem(test, current);
    var txt = sessionStorage.getItem(test);
    $this.text(txt);
    
});

//Stopwatch controls
var timer = document.getElementById('timer');
var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');

var watch = new Stopwatch(timer);

function start() {
  watch.start();
  toggleBtn.textContent = 'Stop';
}

function stop() {
  watch.stop();
  toggleBtn.textContent = 'Start';
}

toggleBtn.addEventListener('click', function() {
  (watch.isOn) ? stop() : start();
});

resetBtn.addEventListener('click', function() {
  watch.reset();
});

//stopwatch
function Stopwatch(elem) {
  var time = 0;
  var interval;
  var offset;

  function update() {
    if (this.isOn) {
      time += delta();
    }
    var formattedTime = timeFormatter(time);
    elem.textContent = formattedTime;
  }

  function delta() {
    var now = Date.now();
    var timePassed = now - offset;
    offset = now;
    return timePassed;
  }

  function timeFormatter(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();

    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }

    while (milliseconds.length < 3) {
      milliseconds = '0' + milliseconds;
    }

    return minutes + ' : ' + seconds + ' . ' + milliseconds;
  }

  this.isOn = false;

  this.start = function() {
    if (!this.isOn) {
      interval = setInterval(update.bind(this), 10);
      offset = Date.now();
      this.isOn = true;
    }
  };

  this.stop = function() {
    if (this.isOn) {
      clearInterval(interval);
      interval = null;
      this.isOn = false;
    }
  };

  this.reset = function() {
    if (!this.isOn) {
      time = 0;
      update();
    }
  };
}
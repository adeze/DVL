function generateData() {
  var realtime = dvl.def(false, 'realtime');
  var metrics = ['aa', 'bb', 'cc'];

  var time = 0;
  var lastTemp = 28;
  var phase = 'Heating';
  var dTemp = {
    'Heating': 2,
    'Idle':    -0.1,
    'Cooling': -1,
  }

  var energyUse = {
    'Heating': 500,
    'Idle':    50,
    'Cooling': 350,
  }
  var idleCount = 0;
  var nextPhase;
  function genOne() {
    time++;

    if (phase != 'Idle') {
      if (lastTemp > 98  && phase != 'Cooling') {
        idleCount = Math.floor(Math.random() * 10) + 2;
        nextPhase = 'Cooling';
        phase = 'Idle';
      } else if (lastTemp < 60 && phase != 'Heating') {
        idleCount = Math.floor(Math.random() * 10) + 2;
        nextPhase = 'Heating';
        phase = 'Idle';
      }

    } else {
      idleCount--;
      if (idleCount <= 0) {
        phase = nextPhase;
      }
    }

    lastTemp += dTemp[phase];
    lastTemp += (Math.random()-0.5)*3;

    var bubbleMult = (phase == 'Heating')?(Math.random()+0.7):(Math.random()+0.2);

    return {
      time: time,
      temp: lastTemp,
      phase: phase,
      bubbling: Math.max(0, Math.pow(lastTemp-72, 3)*bubbleMult),
      energy: energyUse[phase]*(Math.random()+0.5)
    };
  }

  var data = [];
  for (var i = 0; i < 100; i++) {
    data.push(genOne())
  }

  var dataDVL = dvl.def(data, 'data');

  setInterval(function() {
    if (!realtime.get()) return;
    data.push(genOne());
    while(data.length > 300) data.shift();
    dataDVL.set(data).notify();
  }, 250);

  return {
    data: dataDVL,
    metrics: dvl.def(metrics, 'metrics'),
    realtime: realtime
  }
}
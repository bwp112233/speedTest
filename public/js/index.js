//jshint esversion: 9
let graphdata, info, dropList, dateString, dateList, prevItem;
let dropDownList = document.getElementById("dates");
let date = document.getElementById("dates").value;
const ctx = document.getElementById('myChart').getContext('2d');
import Chart from 'chart.js';

let graphContainer = '<select id="dates" class="" name="dates" ></select><div id="chartDiv"><canvas id="myChart" width="300" height="300"></canvas></div>';


document.getElementById('dates').addEventListener('change', graph);

async function graph() {
  // document.querySelector('.container').innerText = '';
  // document.querySelector('.container').insertAdjacentHTML('beforeend', graphContainer);

  // let chartDom = document.getElementById('myChart');
  // if (document.querySelector('.chartjs-size-monitor')) {
  //   document.getElementById('myChart').parentNode.removeChild(document.getElementById('myChart'));
  //   document.querySelector('.chartjs-size-monitor').parentNode.removeChild(document.querySelector('.chartjs-size-monitor'));
  //   document.getElementById('chartDiv').insertAdjacentHTML('beforeend', '<canvas id="myChart" width="300" height="300"></canvas>');
  //   console.log('here');
  // }
  let labels = [];
  let data = [];

  date = document.getElementById("dates").value;
  info = {
    date: date
  };
  graphdata = await fetch('/data', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(info)
  });
  graphdata = await graphdata.json();
  graphdata.forEach(function(e) {
    labels.push(e.timestamp.substr(16, 5));
    data.push(e.download.megabytes);
  });
  console.log(graphdata);
  newChart(data, labels);
  // dropdown();
}

async function dropdown() {
  info = {
    date: date
  };
  dropList = await fetch('/data', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(info)
  });

  dropList = await dropList.json();

  dropList.forEach(function(e) {
    dateString = e.timestamp.substr(0, 15);
    dateList = document.querySelectorAll('.option');

    if (dateList.length === 0) {
      dropDownList.insertAdjacentHTML('beforeend', `<option class="option" value="${dateString}">${dateString}</option>`);
      prevItem = dateString;
    }

    for (var i = 0; i < dateList.length; i++) {

      if (dateString === prevItem) {
        prevItem = dateString;
        break;
      } else {
        dropDownList.insertAdjacentHTML('beforeend', `<option class="option" value="${dateString}">${dateString}</option>`);
        prevItem = dateString;
        break;
      }
    }
  });
}




function newChart(data, labels) {
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [{
        label: 'Speedtest',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: data
      }]
    },

    // Configuration options go here
    options: {}
  });
}


dropdown();
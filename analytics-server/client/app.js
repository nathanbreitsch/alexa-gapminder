$(function(){
  function agmViewModel(){
    var self = this;
    self.version = -1;

    self.test = function(){
      reqwest({
        url: '/question',
        type: 'json',
        method: 'post',
        data: {
          question: {
            type: 'top',
            stat: 'ALCOHOL CONSUMPTION booze'
          }
        }
      })
      .then(function (resp) {

      }, function (err, msg) {
        console.error(err);
      });
    };



    self.update = function(){
      reqwest({
        url: '/update',
        type: 'json',
        method: 'post',
        data: {version: self.version}
      })
      .then(function (resp) {

        if(resp.version > self.version){
          self.renderVisualization(resp.visualization);
          self.version = resp.version;
        }

        console.log(resp.visualization);
      }, function (err, msg) {
        console.error(err);
      });
    };

    self.renderVisualization = function(visualization){
      if(visualization.type == 'relationship'){
        self.makeScatter(visualization);
      }
      else if(visualization.type == 'top'){
        self.makeTop(visualization);
      }
    };


    self.makeScatter = function(visualization){
      $('#content').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: visualization.title
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            title: {
                enabled: true,
                text: visualization.stat1
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: visualization.stat2
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        },
        series: [{
          name: 'Countries',
          dataLabels: {
            enabled: true,
            formatter: function(){
              return this.point.name
            }
          },
          data: visualization.data.map(function(d){
            //d.color = "#00FF00";
            return d;
          })
        }]
    });
    }

    self.makeTop = function(visualization){
      $('#content').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: visualization.title + " Leaderboard",
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: visualization.title
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: visualization.title
        },
        series: [{
            name: visualization.title,
            data: visualization.data,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
    };


    setInterval(self.update, 2000);
  }

  ko.applyBindings(new agmViewModel());
});

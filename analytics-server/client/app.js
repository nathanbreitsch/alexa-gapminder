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
            type: 'relationship',
            stat1: 'GDP',
            stat2: 'Infant Mortality Rate'
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

        console.log(resp.version);
      }, function (err, msg) {
        console.error(err);
      });
    };

    self.renderVisualization = function(visualization){
      if(visualization.type == 'scatter'){
        self.makeScatter(visualization);
      }
    };


    self.makeScatter = function(visualization){
      $('#content').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Height Versus Weight of 507 Individuals by Gender'
        },
        subtitle: {
            text: 'Source: Heinz  2003'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Height (cm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
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
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} cm, {point.y} kg'
                }
            }
        },
        series: [{
            name: 'Female',
            color: 'rgba(223, 83, 83, .5)',
            data: visualization.data

        }],
    });
    }

    setInterval(self.update, 2000);
  }

  ko.applyBindings(new agmViewModel());
});

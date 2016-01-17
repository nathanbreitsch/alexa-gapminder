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
            stat1: 'ALCOHOL CONSUMPTION booze',
            stat2: 'EIGHTH GRADE MATH '
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

    setInterval(self.update, 2000);
  }

  ko.applyBindings(new agmViewModel());
});

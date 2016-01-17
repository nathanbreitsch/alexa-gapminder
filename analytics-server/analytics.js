exports.DataContext = function(data){
  //var statmap = require('./statmap.json');
  var self = this;
  self.data = data;


  self.getTop10 = function(stat){

    if(stat === null){
      return {type:'error', data:[]}
    }

    var series = self.data.countries.map(function(country){
      return {
        name: country.name,
        number: country[stat] ? country[stat].reduce(function(a, b){return a + b.value}, 0) / country[stat].length: null,// average over years
      }
    }).sort(function(a,b){
      if(a == null){return 1}
      if(b == null){return -1}
      return b.number - a.number;
    });

    series = series.slice(0, Math.min(series.length, 10));
    series = series.map(function(datum){
      return [datum.name, datum.number];
    });
    return series;
  };

  self.getScatterData = function(stat1, stat2){

    if(stat1 === null || stat2 === null){
      return {type:'error', data:[]}
    }
    var series = self.data.countries.map(function(country){
      return {
        name: country.name,
        x: country[stat1] ? country[stat1].reduce(function(a, b){return a + b.value}, 0) / country[stat1].length: null,// average over years
        y: country[stat2] ? country[stat2].reduce(function(a, b){return a + b.value}, 0) / country[stat2].length : null
      }
    }).filter(function(country){
      return country.x != null && country.y != null;
    });
    return series;
  };
};

exports.DataContext = function(data){
  var statmap = require('./statmap.json');
  var self = this;
  self.data = data;

  

  self.getScatterData = function(stat1, stat2){
    var real_stat_1 = statmap[stat1.toUpperCase()];
    var real_stat_2 = statmap[stat2.toUpperCase()];
    if(real_stat_1 === null || real_stat_2 === null){
      return {type:'error', data:[]}
    }
    var series = self.data.countries.map(function(country){
      return {
        name: country.name,
        x: country[real_stat_1] ? country[real_stat_1].reduce(function(a, b){return a + b.value}, 0) / country[real_stat_1].length: null,// average over years
        y: country[real_stat_2] ? country[real_stat_2].reduce(function(a, b){return a + b.value}, 0) / country[real_stat_2].length : null
      }
    }).filter(function(country){
      return country.x != null && country.y != null;
    });
    return series;
  };
};

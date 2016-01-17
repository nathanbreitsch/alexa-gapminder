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
          self.message(resp.message + resp.version);
          self.version = resp.version;
        }

        console.log(resp.version);
      }, function (err, msg) {
        console.error(err);
      });
    };

    setInterval(self.update, 2000);
  }

  ko.applyBindings(new agmViewModel());
});

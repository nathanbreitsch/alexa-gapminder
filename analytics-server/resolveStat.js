String.prototype.includes = function(other){
  return (this.indexOf(other) > -1);
}

var phrases = {
  alcohol_consumption_per_adult: [
    'alcohol',
    'booze',
    'consumption'
  ],
  battle_deaths: [
    'war',
    'fighting',
    'death',
    'battle',
    'soldier',
    'deaths'
  ],
  BMI_Female: [
    'bmi',
    'female',
    'women',
    'woman'
  ],
  BMI_Male: [
    'bmi',
    ' man',
    'male',
    ' men',
    'dude'
  ],
  female_blood_pressure: [
    'blood',
    'pressure',
    'female',
    'woman',
    'women',
    'hypertension'
  ],
  female_education: [
    'education',
    'female',
    'woman',
    'women',
    'learning',
    'school'
  ],
  gdp_per_capita: [
    'gdp',
    'gross',
    'domestic',
    'product'
  ],
  infant_mortality: [
    'death',
    'mortality',
    'baby',
    'infant'
  ],
  male_blood_pressure: [
    'blood',
    'pressure',
    ' man',
    'male',
    ' men',
    'dude',
    'hypertension'
  ],
  male_education: [
    'education',
    'learning',
    'school',
    ' man',
    'male',
    ' men'
  ],
  math_8th_grade: [
    'eight',
    '8th',
    'grade',
    'math'
  ],
  math_4th_grade: [
    'fourth',
    '4th',
    'grade',
    'math'
  ],
  tobacco_use: [
    'tobacco',
    'cigarette',
    'smoking',
    'nicotine'
  ],
  unemployment: [
    'unemployment',
    'job',
    'work'
  ]
};


exports.resolveStat = function(stat){
  stat = stat.toLowerCase();
  var scores = {
    alcohol_consumption_per_adult: 0,
    battle_deaths: 0,
    BMI_Female: 0,
    BMI_Male: 0,
    female_blood_pressure: 0,
    female_education: 0,
    gdp_per_capita: 0,
    infant_mortality: 0,
    male_blood_pressure: 0,
    male_education: 0,
    math_8th_grade: 0,
    math_4th_grade: 0,
    tobacco_use: 0,
    unemployment: 0
  };

  for(var key in phrases){
    if(phrases.hasOwnProperty(key)){
      key_words = phrases[key];
      key_words.forEach(function(word){
        if(stat.includes(word)){
          scores[key] += 1;
        }
      });
    }
  }

  var top_score = 0;
  var top_stat = null;
  for(var key in scores){
    if(scores.hasOwnProperty(key)){
      score = scores[key];
      if(score > top_score){
        top_score = score;
        top_stat = key;
      }
    }
  }

  return top_stat;


}

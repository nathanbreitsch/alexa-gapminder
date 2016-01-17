var request = require('request');

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("StatFinderIntent" === intentName) {
        findStat(intent, session, callback);
    }
    else if("RelationshipFinderIntent" === intentName){
      findRelationship(intent, session, callback);
    }
    else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    }
    else if("TopTen" == intentName){
      getTop10(intent, session, callback);
    }
    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the Gap Minder interface for Alexa. " +
        "Ask me for a relationships between global development statistics.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For example: ask me if there is a relationship between gdp and 8th grade math achievement";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


function findStat(intent, session, callback){
  var country = intent.slots.Country.value;
  var stat = intent.slots.Stat.value;
  var sessionAttributes = {};

  var title = "";
  var speechOuput = "";
  var reprompt = "What's next?";
  var quit = true;

  if(stat && country){
    speechOutput = "I don't understand what the fuck you just said.";
    title = "WTF?";
    callback(
      sessionAttributes,
      buildSpeechletResponse(title, speechOutput, reprompt, quit)
    );
  }
  else{
    speechOutput = "I don't understand what the fuck you just said.";
    title = "WTF?";
    callback(
      sessionAttributes,
      buildSpeechletResponse(title, speechOutput, reprompt, quit)
    );
  }


}


function getTop10(intent, session, callback){
  var stat = intent.slots.Stat.value;
  var sessionAttributes = {};
  var reprompt = "";
  var speechOutput = "";
  var title = "";
  var quit = true;

  if(stat){
    var options = {
      uri: 'http://45.79.180.157:3000/question',
      method: 'POST',
      json: {
        question: {
          type: 'top',
          stat: stat
        }
      }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body.id) // Print the shortened url.
        speechOutput = "The country with the highest " + stat + " is " + body.top;
        title = "WTF?"
      }
      else {
        speechOutput = "there was a problem handling your request.";
        title = "WTF?"
      }
      callback(
        sessionAttributes,
        buildSpeechletResponse(title, speechOutput, reprompt, quit)
      );
    });

  }
  else{
    speechOutput = "I did not understand your question.";
    title = "WTF?"
    callback(
      sessionAttributes,
      buildSpeechletResponse(title, speechOutput, reprompt, quit)
    );
  }
}


function findRelationship(intent, session, callback){
  var stat1 = intent.slots.FirstStat.value;
  var stat2 = intent.slots.SecondStat.value;
  var sessionAttributes = {};
  var reprompt = "";
  var speechOutput = "";
  var title = "";
  var quit = true;

  if(stat1 && stat2){
    var options = {
      uri: 'http://45.79.180.157:3000/question',
      method: 'POST',
      json: {
        question: {
          type: 'relationship',
          stat1: stat1,
          stat2: stat2
        }
      }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body.id) // Print the shortened url.
        speechOutput = "I will send you a scatter plot depicting the relationship between " + stat1 + " and " + stat2 + ".";
        title = "WTF?"
      }
      else {
        speechOutput = "there was a problem handling your request.";
        title = "WTF?"
      }
      callback(
        sessionAttributes,
        buildSpeechletResponse(title, speechOutput, reprompt, quit)
      );
    });
  }
  else{
    speechOutput = "I don't understand what the fuck you just said.";
    title = "WTF?"
    callback(
      sessionAttributes,
      buildSpeechletResponse(title, speechOutput, reprompt, quit)
    );
  }


}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

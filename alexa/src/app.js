
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
    var speechOutput = "Welcome to the Gap Minder interface for Alexa" +
        "Ask me for a gapminder statistic for a country";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Ask me for a gapminder statistic for a country." +
        "For example: what is the GDP of Canada?";
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
  var quit = false;

  if(stat && country){
    speechOutput = "You just asked me for the " + stat + " of " + country +
      " ,but I don't have the gap minder dataset yet.  Get to work you lazy fuck! ";
    title = stat + " for " + country;
  }
  else{
    speechOutput = "I don't understand what the fuck you just said.";
    title = "WTF?"
  }

  callback(
    sessionAttributes,
    buildSpeechletResponse(title, speechOutput, reprompt, quit)
  );
}


function findRelationship(intent, session, callback){
  var stat1 = intent.slots.FirstStat.value;
  var stat2 = intent.slots.SecondStat.value;
  var sessionAttributes = {};
  var reprompt = "";
  var speechOuput = "";
  var title = "";
  var quit = false;

  if(stat1 && stat2){
    speechOutput = "You just asked me for the relationship between " + stat1 + " and " + stat2 +
      " ,but I don't have the gap minder dataset yet.  Get to work you lazy fuck! ";
    title = "Relationship between " + stat1 + " and " + stat2;
  }
  else{
    speechOutput = "I don't understand what the fuck you just said.";
    title = "WTF?"
  }

  callback(
    sessionAttributes,
    buildSpeechletResponse(title, speechOutput, reprompt, quit)
  );
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

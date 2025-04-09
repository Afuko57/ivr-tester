const { IvrTester } = require("ivr-tester");
const { googleSpeechToText } = require("ivr-tester-transcriber-google-speech-to-text");
const { similarTo, press, hangUp } = require("ivr-tester");

const runTest = async () => {
  const config = { 
    transcriber: googleSpeechToText({ 
      languageCode: "th-TH" 
    }),
    recordings: {
      enabled: true,
      directory: "./recordings"
    }
  };

  try {
    await new IvrTester(config).run(
      { 
        from: process.env.FROM_NUMBER || "+66xxxxxxxxx", //  Twilio
        to: process.env.TO_NUMBER || "+66xxxxxxxxx" // Genesys Cloud 
      },
      {
        name: "Test Genesys Cloud IVR",
        steps: [
          {
            whenPrompt: similarTo("please enter your pin"), 
            then: press("123456"),
            silenceAfterPrompt: 3000,
            timeout: 10000,
          },
          {
            whenPrompt: similarTo("Select Menu"), 
            then: press("1"),
            silenceAfterPrompt: 2000,
            timeout: 10000,
          },
          {
            whenPrompt: similarTo("TY"), 
            then: hangUp(),
            silenceAfterPrompt: 1000,
            timeout: 10000,
          }
        ],
      }
    );
    console.log("Finish testing");
  } catch (error) {
    console.error("Error:", error);
  }
};

runTest();
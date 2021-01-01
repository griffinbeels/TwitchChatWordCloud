import React from "react"
import ReactDOM from "react-dom"
import { SimpleWordcloud } from './Wordcloud.js' // word cloud construction
const tmi = require('tmi.js'); // necessary for twitch client
const sw = require('stopword'); // stopwords for processing message
require('dotenv').config(); // credentials for bot login

// CONFIGS
// TODO: users can spend bits to increase the weight of their next message in the chat (e.g., your words will appear larger and have a bigger impact on the wordcloud!).
const minWordLength = 2; // length of a very short word, like dog, and also common emojis like <3, :(, etc.
const maxWordLength = 25; // length of a very long twitch emote name
const contribPerMessage = 1; // number of words per message from the same user that contribute to the word cloud



// CHATBOT LOGIC
// Define configuration options
var client = null;

// TODO: create WordcloudBot account
// TODO: webapp that lets you simply enter a user & connect?
// TODO: add back .env stuff
// TODO: change structure to be more similar to App.js example
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};
  
  // Called every time a message comes in
  function onMessageHandler (target, context, msg, self) {
    
    // if (self) { return; } // Ignore messages from the bot
  
    // Remove whitespace from chat message
    var message = msg.trim().replace( /\n/g, " " ).split(' ');

    // Stopwords - remove all common stopwords present in English. 
    // TODO: swap stopwords based on Channel Language (e.g., add support for Chinese in addition to English)
    // TODO: option to swap stopwords based on Twitch emotes for channel (if not wanted).
    message = sw.removeStopwords(message);


    // count of each word for this message
    var wordCountForMessage = {}


    // Go through all words in the message
    for(var i = 0; i < message.length; i++) {
        let word = processWord(message[i], wordCountForMessage)
        //TODO: filter specific words (like swears)
        //TODO: min word length, max word length
        //TODO: filter out emojis  (get the streamer's emoji list)
        //TODO: ignore rlly common words
        if (word !== null){
            if (client.wordcloudIdx[word] == null){ // new word detected, base case
                var numWords = client.words.length;
                client.wordcloudIdx[word] = numWords;
                client.words.push({
                    "text": word,
                    "value": 1,
                });
                wordCountForMessage[word] = 1;
            }else{ // word seen before, simply increment
                var idx = client.wordcloudIdx[word];
                client.words[idx]["value"]++;
                wordCountForMessage[word]++;
            } 
        }
    }




    // Rerender after processing message
    // client.totalWordsProcessed++;
    // if (client.totalWordsProcessed % 5 == 0){
      ReactDOM.render(
        generateNewWordcloud(client),
        document.getElementById("root")
      )
    //   console.log("should render")
    // }
  }

  function processWord(word, wordCountForMessage){
    word = word.trim().toLowerCase(); // no surrounding whitespace, lowercase.
    var count = wordCountForMessage[word] == null ? 0 : wordCountForMessage[word]; // count of 0 for first word seen
    if (word !== null 
        && word !== ""
        && count < contribPerMessage
        && word.length >= minWordLength
        && word.length <= maxWordLength){
          // TODO: any additional processing on the word
      return word;
    }
    return null; // invalid word
  }
  
  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }
  
  export function startListeningToChat(wordcloud){
    // Create a client with our options
    client = new tmi.client(opts);
    
    // Register our event handlers (defined below)
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);
    
    // Connect to Twitch:
    client.connect();
    client.words = []
    client.totalWordsProcessed = 0;

    client.wordcloudIdx = {}; // idx into wordcloud
    client.wordcloudComponent = SimpleWordcloud(client); // empty wordcloud
    
    return client;
  }

  export function generateNewWordcloud(client){
    // TODO: generate wordcloud using emoji
    client.wordcloudComponent = SimpleWordcloud(client);
    return client.wordcloudComponent;
  }
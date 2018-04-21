require("dotenv").config();

const opn = require('opn');
const fs = require("fs");
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require("request");
const moment = require('moment');
const hr = '-----------------------------------------------------------------------------';
const dblRow = '=============================================================================';
const spacer = '';

let nodeArgs = process.argv;
let displayArray = [];

const doCommand = () => {
  let command = nodeArgs[2];
  switch (command){
    case 'my-tweets':
      myTweets();
      break;
    case 'spotify-this-song':
      spotifyThisSong();
      break;
    case 'movie-this':
      movieThis();
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('unknown command');
  }
};

const myTweets = () => {
  /*
    This will show your last 20 tweets and when they were created at in your terminal/bash window.
    ======================================================================================
    https://www.npmjs.com/package/twitter
    ======================================================================================
*/
  let client = new Twitter(keys.twitter);
  let params = {screen_name: '@LIRI_bot_tester', count: 20};
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (!error) {
      let i = 1;
      displayArray = [
        dblRow,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        'my-tweets called:',
        spacer,
        'Here are (up to) 20 of the most recent tweets from @LIRI_bot_tester:',
        hr,
      ];
      tweets.forEach((tweet) => {
        displayArray.push(` * Tweet # ${i}: (${tweet.created_at}) ${tweet.text}`);
        i++;
      });
      displayArray.push(dblRow, spacer);
      logToConsole(displayArray);
      logFile(displayArray);
      displayArray = [];
    }
  });
};

const spotifyThisSong = () => {
  /*
      This will show the following information about the song in your terminal/bash window:
        * Artist(s)
        * The song's name
        * A preview link of the song from Spotify
        * The album that the song is from
      If no song is provided then your program will default to "The Sign" by Ace of Base.
      ======================================================================================
      https://www.npmjs.com/package/node-spotify-api
      ======================================================================================
  */
  let songName;
  (nodeArgs.length < 4) ? songName = 'The Sign Ace of Base' : songName = nodeArgs[3];
  let spotify = new Spotify(keys.spotify);
  spotify.search({ type: 'track', query: songName, limit: 1 }, (error, data) => {
    if (error) {
      return console.log('Error occurred: ' + error);
    }
    else {
      let artistNamesArray = [];
      data.tracks.items[0].artists.forEach((artist) => {
        artistNamesArray.push(artist.name);
      });
      displayArray = [
        dblRow,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        `spotify-this called: ${songName}`,
        spacer,
        `Here is the information I was able to find on Spotify regarding "${songName}":`,
        hr,
        ` * Artist(s): ${artistNamesArray.join(', ')}`,
        ` * Song Title: ${data.tracks.items[0].name}`,
        ` * Preview Link: ${data.tracks.items[0].external_urls.spotify}`,
        ` * Album:' ${data.tracks.items[0].album.name}`,
        dblRow,
        spacer,
      ];
      logToConsole(displayArray);
      logFile(displayArray);
      displayArray = [];
      // opn(link);
      // process.exit()
    }
  });
};

const movieThis = () => {
  /* This will output the following information to your terminal/bash window:
      * Title of the movie.
      * Year the movie came out.
      * IMDB Rating of the movie.
      * Rotten Tomatoes Rating of the movie.
      * Country where the movie was produced.
      * Language of the movie.
      * Plot of the movie.
      * Actors in the movie.
  */
  let movieName;
  (nodeArgs.length < 4) ? movieName = 'Mr. Nobody' : movieName = nodeArgs[3];
  let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let responseRoot = JSON.parse(body);
      displayArray = [
        dblRow,
        moment().format('MMMM Do YYYY, h:mm:ss a'),
        `movie-this called: ${movieName}`,
        '',
        `Here is the information I was able to find regarding "${movieName}":`,
        hr,
        ` * Title: ${responseRoot.Title}`,
        ` * Release Year: ${responseRoot.Year}`,
        ` * IMDB Rating: ${responseRoot.Ratings[0].Value}`,
        ` * Rotten Tomatoes Rating: ${responseRoot.Ratings[1].Value}`,
        ` * Production Country: ${responseRoot.Country}`,
        ` * Language(s): ${responseRoot.Language}`,
        ` * Plot: ${responseRoot.Plot}`,
        ` * Actors: ${responseRoot.Actors}`,
        dblRow,
        '',
      ];
      logToConsole(displayArray);
      logFile(displayArray);
      displayArray = [];
    }
  });
};

const doWhatItSays = () => {
  fs.readFile("random.txt", "utf8", (error, data) => {
    if (error) {
      return console.log(error);
    }
    let dataArr = data.split(", ");
    nodeArgs[2] = dataArr[0];
    nodeArgs[3] = dataArr[1];
    doCommand();
  });
};

const logFile = (array) => {
  for (let item of array) {
    fs.appendFileSync('log.txt', item +'\n');
    item++
  }
};

const logToConsole = (array) => {
  for (let line of array) {
    console.log(line);
  }
};

doCommand();

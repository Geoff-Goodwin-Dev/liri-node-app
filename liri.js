require("dotenv").config();

const opn = require('opn');
let keys = require('./keys.js');
let Spotify = require('node-spotify-api');
let Twitter = require('twitter');
let request = require("request");


let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let command = process.argv[2];
let nodeArgs = process.argv;

// install Inquirer Node package!!!

function doCommand () {
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
  }
}

function myTweets() {
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
      let i = 0;
      console.log(
        'Here are (up to) 20 of the most recent tweets from @LIRI_bot_tester:',
        '\n-------------------------------------------------------------------');
      tweets.forEach((tweet) => {
        i++;
        let createdDateTime = tweet.created_at;
        let tweetText = tweet.text;
        console.log('  * Tweet #' + i + ': (' + createdDateTime + ') ' + tweetText);
        console.log('-------------------------------------------------------------------');
      })
    }
  });
}

function spotifyThisSong(){
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
  spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    let artistNamesArray = [];
    data.tracks.items[0].artists.forEach((artist) => {
      artistNamesArray.push(artist.name);
    });
    let artists = artistNamesArray.join(', ')
      , song = data.tracks.items[0].name
      , link = data.tracks.items[0].external_urls.spotify
      , album = data.tracks.items[0].album.name;
    console.log(
      'Here is the information I was able to find on Spotify regarding "' + songName + '":',
      '\n---------------------------------------------------------------------------------',
      '\n * Artist(s):', artists,
      '\n * Song Title:', song,
      '\n * Preview Link:', link,
      '\n * Album:', album,
    );
    console.log('-------------------------------------------------------------------');
    opn(link);
    process.exit()
  });
}

function movieThis() {
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
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(
        'Here is the information I was able to find regarding "' + movieName + '":',
        '\n-----------------------------------------------------------------------',
        '\n * Title:', JSON.parse(body).Title,
        '\n * Release Year:', JSON.parse(body).Year,
        '\n * IMDB Rating:', JSON.parse(body).Ratings[0].Value,
        '\n * Rotten Tomatoes Rating:', JSON.parse(body).Ratings[1].Value,
        '\n * Production Country:', JSON.parse(body).Country,
        '\n * Language(s):', JSON.parse(body).Language,
        '\n * Plot:', JSON.parse(body).Plot,
        '\n * Actors:', JSON.parse(body).Actors,
      );
      console.log('-------------------------------------------------------------------');
    }
  });
}

function doWhatItSays() {
  console.log('do what it says called');
}

doCommand();
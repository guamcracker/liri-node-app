require("dotenv").config();

var keys = require("./keys.js")

// importing request functionality for making ombd call leter in liri object
var request = require('request');

// condensing the arguments syntax
var arg = process.argv;
// console.log(process.argv[3])
// importing the file reading/writing functionality
var fs = require("fs");

////////////////////////////////////////////////
//require in packages before using them
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

///////////////////////////////////////////////

// this is the central functionality (LIRI)
var liri = {

	// this will take data from a text file and then calls the functionality (spotify in this case) as defined in the file
	says() {
		console.log("=============");
		console.log("says function");
		console.log("=============");
		fs.readFile("random.txt", "utf-8", function(error, data) {
			if (error) {
				return console.log(error);
			}
			console.log("Reading stored file and redirecting to the music function");
			var command = data.split(",");
			arg[2] = command[0];
			arg[3] = command[1];
			liri.runtime();
		})
	},

	// ombd functionality
	movie() {
		if (!arg[3]) {
		// default movie, if no input from user
			console.log("===============================================================================================");
			console.log("Since you did not enter a movie title, please see the results below for the movie \"Mr. Nobody\"!");
			console.log("===============================================================================================");
			request("http://www.omdbapi.com/?t=mr+nobody+&y=&plot=short&apikey=40e9cece", function(error, response, body) {
				if (!error && response.statusCode === 200) {
					console.log("The movie's title is: " + JSON.parse(body).Title);
					console.log("This movie was released in the year: " + JSON.parse(body).Year);
					console.log("The movie's IMDB rating is: " + JSON.parse(body).imdbRating);
					console.log("The movie's Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
					console.log("The movie was produced in: " + JSON.parse(body).Country);
					console.log("The language(s) this movie was made in is/are: " + JSON.parse(body).Language);
					console.log("The movie's plot is: " + JSON.parse(body).Plot);
					console.log("The movie's actors are: " + JSON.parse(body).Actors);
				}
			});
		} else {
		// takes user's input and returns results
			console.log("==========================================");
			console.log("Please see below for your movie's results!")
			console.log("==========================================");
			request("http://www.omdbapi.com/?t=" + arg[3] + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
				if (!error && response.statusCode === 200) {
					console.log("The movie's title is: " + JSON.parse(body).Title);
					console.log("This movie was released in the year: " + JSON.parse(body).Year);
					console.log("The movie's IMDB rating is: " + JSON.parse(body).imdbRating);
					console.log("The movie's Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
					console.log("The movie was produced in: " + JSON.parse(body).Country);
					console.log("The language(s) this movie was made in is/are: " + JSON.parse(body).Language);
					console.log("The movie's plot is: " + JSON.parse(body).Plot);
					console.log("The movie's actors are: " + JSON.parse(body).Actors);
				}
			});
		}
	},

	// twitter functionality
	tweets() {
		console.log("============================================");
		console.log("Below are the last 20 Tweets on this account");
        console.log("============================================");
        var params = {screen_name: 'baddadjokes'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				for (var i = 0; i < tweets.length; i++) {
					console.log(tweets[i].text);
				}
			} else {
				console.log(error);
			}
		});
	},

	// spotify functionality
	music() {
		console.log("==============");
		console.log("music function");
		console.log("==============");
		var song = arg[3];
		// console.log("song: " + song);
		if (!song) {
			// "The Sign" by Ace of Base (default song)
			spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
				if (err) {
					return console.log('Error occurred: ' + err);
				}
				console.log("This song is from the artist(s): " + data.tracks.items[8].artists[0].name);
				console.log("This song's name is: " + data.tracks.items[8].name);
				console.log("Preview url for this track: " + data.tracks.items[8].preview_url);
				console.log("This song is from the album: " + data.tracks.items[8].album.name);
			});
		} else {
			// user's song choice, or from random.txt
			spotify.search({ type: 'track', query: song }, function(err, data) {
				if (err) {
					return console.log('Error occurred: ' + err);
				}
				console.log("This song is from the artist(s): " + data.tracks.items[0].artists[0].name);
				console.log("This song's name is: " + data.tracks.items[0].name);
				console.log("Preview url for this track: " + data.tracks.items[0].preview_url);
				console.log("This song is from the album: " + data.tracks.items[0].album.name);
			});
		}
	},

	// function that runs initially and directs the user to different funcitions based on input
	runtime() {
		if (arg[2] === "my-tweets") {
			liri.tweets();
		} else if (arg[2] === "spotify-this-song") {
			liri.music();
		} else if (arg[2] === "movie-this") {
			liri.movie();
		} else if (arg[2] === "do-what-it-says") {
			liri.says();
		}
	},
	
};

// calling function to direct user's query
liri.runtime();
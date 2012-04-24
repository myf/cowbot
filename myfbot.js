irc = require('irc');
var exec = require('child_process').exec,
    sleep = require('sleep'),
    channel = '#cowbot';

function addslashes( str,callback ) {
    catmes = (str+'').split(/^moo/)[1].replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
    callback(catmes);
}

function cowsay(string, callback) {
    var command = "echo $INPUT | cowsay -f cows/hacker.cow";

    exec(command, {env: {INPUT: string}}, function(error, stdout,stderr){
        var child = stdout;
        var raw = child.match(/^.*([]+|$)/gm);
        console.log(raw);
        callback(raw);
    });
}

var bot = new irc.Client('irc.freenode.net', 'cowbot', {
    debug: false,
    channels: [channel],
    realName: "James Joyce",
});

bot.addListener('error', function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

bot.addListener('message', function (from, to ,message) {
    if (message.match(/^moo/)) {
        addslashes(message, function (catmes) {
                cowsay(catmes, function(raw){
                    var counter = 0;
                    var interval = setInterval(function () {
                        console.log(raw[counter]);
                        bot.say(channel,raw[counter]);
                        counter++;
                        if (counter>=raw.length) {
                            clearInterval(interval);
                        }
                    }, 1000);
                });
        });
    }
});



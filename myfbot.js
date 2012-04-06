irc = require('irc');
var exec = require('child_process').exec,
    sleep = require('sleep');

function cowsay(string, callback) {
    echo = "echo ";
    cowsay = string.concat(" | cowsay -f ~/hacker.cow");
    command = echo.concat(cowsay);
    exec(command, function(error, stdout,stderr){
        var child = stdout;
        var raw = child.match(/^.*([]+|$)/gm);
        console.log(raw);
        callback(raw);
    });
}
    
var bot = new irc.Client('irc.freenode.net', 'myfbot', {
    debug: false,
    channels: ['#hackerschool'],
    realName: "James Joyce",
});

bot.addListener('error', function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

bot.say('#hackerschool','hello world');
var on =false
bot.addListener('message', function (from, to ,message) {
    if (message.match(/moo/i)) {
        on = true;
    }
    if (message.match(/mooo/i)) {
        on = false;
    }
    if (on) {
        //bot.say("#hackerschool",message);
        cowsay(message, function(raw){
            for (i=0;i<raw.length;i++){
                bot.say("#hackerschool",raw[i], function(){sleep.usleep(500000);});
            }

        });
    }
});


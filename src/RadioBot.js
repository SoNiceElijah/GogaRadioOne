const Discord = require('discord.js');
const client = new Discord.Client();

const ytdl = require('ytdl-core');

const info = require('./config.json');

const broadcast = client.voice.createBroadcast();
broadcast.play('./music.mp3');

let connections = {};
let broadcasts = {};
let playlist = {};
let playNum = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    /*client.guilds.cache.each(g =>{
      let voices = g.channels.cache.filter(e => e.type === 'voice');
      voices.each(v => {
        v.join().then(c => {
          console.log(c);
        })
      })
    }); */
});

client.on('message', msg => {

    if (msg.author.id === client.user.id) return;

    if (msg.content.indexOf(info.prefix) !== 0) return;

    msg.content = msg.content.slice(1).trim();

    let args = msg.content.split(/ +/g);

    if (args.length == 0) return;

    if (args[0] === 'join') {
        if (!args[1]) {
            
            let station = msg.guild.channels.cache.find(c => c.type === 'voice');
            station.join()
                .then((conn) => {
                    msg.channel.send(`I'm connected to ${conn.channel.name}`);
                    connections[msg.guild.id] = conn;
                })
        } else {

            args[1] = args[1].toLowerCase();

            let station = msg.guild.channels.cache.find(c => c.name.toLowerCase() === args[1] && c.type === 'voice');
            if (!station) {
                msg.channel.send(`Can't find chat ${args[1]}`);
                return;
            }

            station.join()
                .then((conn) => {
                    msg.channel.send(`I'm connected to ${conn.channel.name}`);
                    connections[msg.guild.id] = conn;
                })
        }

        return;
    }

    if(args[0] === 'leave')
    {
        if(connections[msg.guild.id])
        {
            connections[msg.guild.id].channel.leave();
            msg.channel.send('Disconnected!');
        }

        return;
    }

    if(args[0] === 'play')
    {
        if(connections[msg.guild.id])
        {
            if(broadcasts[msg.guild.id])
            {
                broadcasts[msg.guild.id].resume();
            }
            else
            {
                playNum[msg.guild.id] = 0;
                playlist[msg.guild.id] = [];
                playlist[msg.guild.id].push('https://www.youtube.com/watch?v=gykWYPrArbY');
                setAudio(msg);
            }
        }

        return;
    }

    if(args[0] === 'stop')
    {
        if(broadcasts[msg.guild.id])
            broadcasts[msg.guild.id].pause();
    }

    if(args[0] === 'next')
    {
        if(!args[1]) return;
        
        playlist[msg.guild.id].push(args[1]);
    }

    if(args[0] === '>>')
    {
        nextSong(msg);
    }
});

client.login(info.token);

function setAudio(msg) {

    console.log(`New song for ${msg.guild.name}`);
    broadcasts[msg.guild.id] = connections[msg.guild.id].play(ytdl(playlist[msg.guild.id][playNum[msg.guild.id]],{ filter : 'audioonly'}));
    broadcasts[msg.guild.id].on('finish',() => { nextSong(msg); });
}

function nextSong(msg) {

    if(playNum[msg.guild.id] < playlist[msg.guild.id].length - 1)
    {
        playNum[msg.guild.id] = playNum[msg.guild.id] + 1;
    }
    else
    {
        playNum[msg.guild.id] = 0;
    }

    setAudio(msg);

}

module.exports = () => {};
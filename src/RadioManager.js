const ytdl = require('ytdl-core');

let connections = {};
let broadcasts = {};
let playlist = {};
let playNum = {};

let headers = {};

const $ = require('./DataManager');

function saveConnaction(conn,msg) {
    connections[msg.guild.id] = conn;
}

function getConnaction(msg) {
    return connections[msg.guild.id];
}

function radioPlay(msg) {
    if(broadcasts[msg.guild.id])
    {
        broadcasts[msg.guild.id].resume();
    }
    else
    {
        playNum[msg.guild.id] = 0;
        playlist[msg.guild.id] = [];
        playlist[msg.guild.id].push({ name : 'default', link : 'https://www.youtube.com/watch?v=gykWYPrArbY'});
        setAudio(msg);
    }
}

function radioStop(msg) {
    if(broadcasts[msg.guild.id])
        broadcasts[msg.guild.id].pause();
}

function addSong(msg,args) {

    if(!args[1]) return;        
        playlist[msg.guild.id].push({
            name : 'unknown',
            link : args[1],
        });

}

function setAudio(msg) {

    console.log(`New song for ${msg.guild.name}`);
    broadcasts[msg.guild.id] = connections[msg.guild.id].play(ytdl(playlist[msg.guild.id][playNum[msg.guild.id]].link,{ filter : 'audioonly'}));
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

function prevSong(msg) {
    
    if(playNum[msg.guild.id] > 0)
    {
        playNum[msg.guild.id] = playNum[msg.guild.id] - 1;
    }
    else
    {
        playNum[msg.guild.id] = playlist[msg.guild.id].length - 1 ;
    }

    setAudio(msg);
}

async function setPlaylist(msg, args)
{
    if(!args[1])
        {
            return msg.channel.send('Enter playlist name: -playlist <name>');
        }

        let list = await $.getPlaylistByName(args[1]);

        if(!list)
        {
            return msg.channel.send(`Can't find ${args[1]} playlist`);
        }

        let tracks = await $.getPlaylistTracks(list._id + '');

        if(tracks.length === 0)
        {
            return msg.channel.send(`Playlist is empty...`);
        }

        playNum[msg.guild.id] = 0;
        playlist[msg.guild.id] = tracks;

        headers[msg.guild.id] = list._id + '';

        setAudio(msg);

        msg.channel.send(`Now playing playlist ${list.name}`);
}


async function editPlaylist(hid) {

    console.log('tryEdit!');

    for(let param in headers)
    {
        if(headers[param] === hid)
        {
            let data = await $.getPlaylistTracks(hid);

            if(data.length != 0)
                playlist[param] = data;

        }
    }

}

function getPlaylist(msg, args)
{
    let str = '';
    for(let i = 0; i < playlist[msg.guild.id].length; ++i)
    {
        if(i == playNum[msg.guild.id])
        {
            str += '-> ';
        }
        str += playlist[msg.guild.id][i].name + '\n';
    }

    msg.channel.send(str);
}

module.exports = {
    saveConnaction,
    getConnaction,
    nextSong,
    prevSong,
    setAudio,
    getPlaylist,
    setPlaylist,
    radioPlay,
    radioStop,
    addSong,
    editPlaylist

}
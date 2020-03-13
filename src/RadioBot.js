const Discord = require('discord.js');
const client = new Discord.Client();

const info = require('./config.json');

const R = require('./RadioManager');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {

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
                    R.saveConnaction(conn,msg);
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
                    R.saveConnaction(conn,msg);
                })
        }

        return;
    }

    if(args[0] === 'leave')
    {
        if(R.getConnaction(msg))
        {
            R.getConnaction(msg).channel.leave();
            msg.channel.send('Disconnected!');
        }

        return;
    }

    if(args[0] === 'play')
    {
        if(R.getConnaction(msg))
        {
            R.radioPlay(msg);
        }

        return;
    }

    if(args[0] === 'stop')
    {
        R.radioStop(msg);
        return;
    }

    if(args[0] === 'next')
    {
        R.addSong(msg,args);
        return;
    }

    if(args[0] === '>>')
    {
        R.nextSong(msg);
        return;
    }

    if(args[0] === '<<')
    {
        R.prevSong(msg);
        return;
    }

    if(args[0] === 'manage')
    {
        msg.channel.send('http://165.22.91.225:2000/');
        return;
    }

    if(args[0] === 'playlist')
    {
        R.setPlaylist(msg, args);
        return;
    }

    if(args[0] == 'list')
    {
        R.getPlaylist(msg, args);
        return;
    }
});

client.login(info.token);



module.exports = () => {};
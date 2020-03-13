const express = require('express');
const app = express();

const __maindir = require('path').dirname(require.main.filename);

const bp = require('body-parser');
const axios = require('axios');

const $ =  require('./DataManager');
const R = require('./RadioManager');

module.exports = async () => {
    
    app.set('view engine', 'pug');
    app.set('views','site');

    app.use(bp());
    app.use(express.static(__maindir + '/public'));

    app.get('/', async (req,res) => {

        let data = await $.playlists();

        res.render('main',{list : data});

    });

    app.get('/listPage', async (req,res) => {
        let data = await $.playlists();
        res.render('site',{list : data});
    });

    app.get('/playlist', async (req,res) => {

        if(req.query['id'])
        {
            let data = await $.getPlaylist(req.query['id']);
            let tracks = await $.getPlaylistTracks(req.query['id']);

            res.render('box',{
                empty : false,
                ...data,
                playlist : tracks
            });
        }
        else
        {
            res.render('box',{ empty : true, name : '', desc : '' });
        }

    });

    app.post('/check',async (req,res) => {

        if(!req.body.url)
            return res.sendStatus(400);

        if(req.body.url.indexOf('youtube') === -1)
            return res.sendStatus(400);

        axios.get(req.body.url)
            .then((data) => {
                if(!data)
                    return res.json({
                        status : false
                    })

                let pattern = /<title>.*<\/title>/gi;
                let match = data.data.match(pattern);

                match[0] = match[0].slice(7, match[0].length - 18);

                res.json({
                    status : true,
                    name : match[0]
                });
            })
            .catch((e) => {
                return res.json({
                    status : false
                })
            });
       
    });

    app.post('/new', async (req,res) => {
        
        let model = {
            name : req.body.name,
            desc : req.body.desc 
        };

        let playlist = await $.getPlaylistByName(req.body.name);

        if(isNullOrWhitespace(req.body.name))
        {
            return res.json({
                static : false,
                msg : 'Empty name!!!!!'
            });
        }

        if(playlist)
            return res.json({
                status : false,
                msg : 'name already taken'
            });

        await $.createPlaylist(model);

        res.json({
            status : true
        })

    });

    app.post('/add', async (req,res) => {

        let model = {
            name : req.body.name,
            link : req.body.link
        }

        if(isNullOrWhitespace(model.name))
        {
            return res.json({
                status : false
            })
        }

        if(isNullOrWhitespace(model.link))
        {
            return res.json({
                status : false
            })
        }

        if(isNullOrWhitespace(req.body.id))
        {
            return res.json({
                status : false
            })
        }

        await $.addTrack(req.body.id,model);
        R.editPlaylist(req.body.id);

        return res.json({
            status : true
        });

    });

    app.post('/remove', async (req,res) => {
        if(!req.body.id)
            return res.json({
                status : false
            })

        let hid = await $.removeTrack(req.body.id);
        R.editPlaylist(hid);

        res.json({
            status : true
        })
    })

    app.listen(2000,() => {
        console.log('Public is up');
    })

};

function isNullOrWhitespace( input ) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}
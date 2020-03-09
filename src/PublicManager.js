const express = require('express');
const app = express();

const __maindir = require('path').dirname(require.main.filename);

const bp = require('body-parser');
const axios = require('axios');

module.exports = async () => {
    
    app.set('view engine', 'pug');
    app.set('views','site');

    app.use(bp());
    app.use(express.static(__maindir + '/public'));

    app.get('/', async (req,res) => {

        let data = [{
            id : 'dsfsfsdf',
            name : 'SuperTest',
            desc : 'Big description with a lot of words for chaeck elipsis'
        },
        {
            id : 'dsfsfsdf',
            name : 'SuperTest',
            desc : 'Smth for test'
        },
        {
            id : 'dsfsfsdf',
            name : 'sdgsgsdgd g dsgsdgsdgsddgsdgs gsdgs  dg sdg',
            desc : 'Smth for test'
        },
        {
            name : 'SuperTest',
            desc : 'Smth for test'
        },
        {
            id : 'dsfsfsdf',
            name : 'SuperTest',
            desc : 'Smth for test'
        },
        {
            id : 'dsfsfsdf',
            name : 'SuperTest',
            desc : 'Smth for test'
        },
        {
            id : 'dsfsfsdf',
            name : 'SuperTest',
            desc : 'Smth for test'
        },
        {
            id : 'dsfsfsdf',
            name : 'SuperTest',
            desc : 'Smth for test'
        },
        {
            id : 'dsfsfsdf',
            name : 'SuperTest',
            desc : 'Smth for test'
        },
        {
            id : 'dsfsfsdf',
            name : 'SuperTest',
            desc : 'Smth for test'
        }];
        res.render('main',{list : data});

    });

    app.get('/playlist', async (req,res) => {

        if(req.query['id'])
        {
            res.render('box',{
                id : 'afsdfsdf',
                name : 'LOL', 
                desc : 'so nice playlist', 
                playlist : [{
                    id : 'wetwet',
                    name : 'one',
                    link : 'link'
                },
                {
                    id : 'wetwet',
                    name : 'two',
                    link : 'link'
                }]
            });
        }
        else
        {
            res.render('box',{name : '', desc : '', playlist : []});
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

    app.listen(2000,() => {
        console.log('Public is up');
    })

};
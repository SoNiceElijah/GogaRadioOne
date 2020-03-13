
const mongo = require('mongodb');
const oid = require('mongodb').ObjectId;

let storage;
let headers;

async function init() {
    let client = await mongo.connect("mongodb://localhost:27017",{ useNewUrlParser: true ,useUnifiedTopology: true});
    let db = client.db("GogaRaio");

    storage = db.collection('tracks');
    headers = db.collection('playlists');
}

async function playlists() {
    return await headers.find().toArray();
}

async function getPlaylist(hid) {
    return await headers.findOne({_id : oid(hid)});
}

async function getPlaylistByName(name) {
    return await headers.findOne({ name : name});
}

async function createPlaylist(ctx) {

    let hid = new oid();
    let playlist = {
        _id : hid,
        ...ctx
    };

    await headers.insertOne(playlist);

    return playlist;

}

async function addTrack(hid,ctx) {

    let tids = new oid();
    let track = {
        _id : tids,
        hid : hid,
        ...ctx
    };

    await storage.insertOne(track);

    return track;

}

async function getPlaylistTracks(hid) {

    return await storage.find({ hid : hid}).toArray();

}

async function removeTrack(tid) {

    let hid = await storage.findOne({ _id : oid(tid)})
    await storage.deleteOne({ _id : oid(tid)});

    return hid.hid + ''; 

}

async function deletePlaylist(hid) {

    headers.deleteOne({ _id : oid(hid)});

}




module.exports = {
    init,
    playlists,
    createPlaylist,
    getPlaylist,
    getPlaylistByName,
    getPlaylistTracks,
    addTrack,
    removeTrack,
    deletePlaylist
}

setInterval(async () => {

    let ps = await playlists();
    for(let p of ps)
    {
        let tracks = await getPlaylistTracks(p._id + '');
        if(tracks.length == 0)
        {
            await deletePlaylist(p._id + '');
        }
    }

}, 5 * 60 * 1000)
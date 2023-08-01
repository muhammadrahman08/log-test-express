const express = require('express');
const app = express();
const logger = require('../utils/logger');

require('dotenv').config()
const mongoClient = require('mongodb').MongoClient;
const dbURI = process.env.ATLAS_URI;
const client = new mongoClient(dbURI);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));


app.use((req, res, next) => {
    logger.info(`${req.method} request on the path => ${req.path}`);
    next();
});


app.get('/', (req, res) => {
    try {
        res.sendFile(__dirname + '/views' + '/index.html');
    } catch (err) {
        logger.error(`Failed with error, ${err}`);
    }
});

app.route('/create')
    .get((req, res) => {
        try {
            res.sendFile(__dirname + '/views' + '/create.html');
        } catch (err) {
            logger.error(`Failed with error, ${err}`);
        }
    })
    .post(async (req, res) => {
        try {
            logger.info(`entered /create with ${JSON.stringify(req.body)}`)
            const payloadData = req.body.name;
            if (!payloadData) {
                throw new Error("invalid input");
            }
            const data = { name: payloadData };
            const conn = await client.connect();
            const db = await conn.db("lms");
            const col = await db.collection("users").insertOne(data);
            res.send({ message: "user has been added" });
        } catch (err) {
            logger.error(`Failed with error, ${err}`);
        } finally {
            await client.close()
        }
    });

app.route('/update')
    .get((req, res) => {
        try {
            res.sendFile(__dirname + '/views' + '/update.html');
        } catch (err) {
            logger.error(`Failed with error, ${err}`);
        }
    })
    .put(async (req, res) => {
        try {
            logger.info(`entered /update with ${JSON.stringify(req.body)}`)
            const name = req.body.name;
            const updName = req.body.newName;
            if (!name || !updName) {
                throw new Error("invalid input");
            }
            const filter = { name: name };
            const updateDoc = {
                $set: {
                    name: updName
                }
            }
            const conn = await client.connect();
            const db = await conn.db("lms");
            const col = await db.collection("users").findOneAndUpdate(filter, updateDoc);
            res.send({ message: "user has been updated" })
        } catch (err) {
            logger.error(`Failed with error, ${err}`);
        } finally {
            await client.close();
        }

    });

app.route('/list')
    .get(async (req, res) => {
        try {
            const conn = await client.connect();
            const db = await conn.db("lms");
            const col = await db.collection("users").find({}).toArray();
            let lis;
            if (col.length) {
                lis = col.map(ele => {
                    return `<li>${ele.name}</li>`
                }).join('\n');
                res.send('<ol>' + lis + '</ol>')
            } else {
                res.send('No users sound');
            }
        } catch (err) {
            logger.error(`Failed with error, ${err}`);
        } finally {
            await client.close();
        }
    })

app.route('/delete')
    .get((req, res) => {
        try {
            res.sendFile(__dirname + '/views' + '/delete.html');
        } catch (err) {
            logger.error(`Failed with error, ${err}`);
        }
    })
    .delete(async (req, res) => {
        try {
            logger.info(`entered /delete with ${JSON.stringify(req.body)}`)
            const payloadData = req.body.name;
            if (!payloadData) {
                throw new Error("invalid user name")
            }
            const data = {
                name: payloadData
            }
            const conn = await client.connect();
            const db = await conn.db("lms");
            const col = await db.collection("users").findOneAndDelete(data);
            res.send({ message: "user has been deleted" });
        } catch (err) {
            logger.error(`Failed with error, ${err}`);
        } finally {
            await client.close();
        }
    });

app.listen(3000, () => {
    console.log("server is running in localhost:3000");
});

module.exports = app;
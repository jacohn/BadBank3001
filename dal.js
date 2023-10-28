import pkg from 'mongodb'
import bcrypt from 'bcrypt';
const {MongoClient}= pkg;
const url = 'mongodb://localhost:27017';
let db = null;

// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if(err){ 
        console.error("Failed to connect to the database: ", err);
        return;
    }
    console.log("Connected successfully to db server");

    // connect to myproject database
    db = client.db('myproject');
});


// create user account using the collection.insertOne function
async function create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject)=>{
        const userCollection = db.collection('users');
        const doc= {name, email, password: hashedPassword, balance: 0};
        userCollection.insertOne(doc, {w:1}, function(err, result){
            err ? reject(err): resolve(doc);
        });
    })
}

// find user account 
function find(email) {
    return new Promise((resolve, reject) => {
        const userCollection = db
            .collection('users')
            .find({ email: email })
            .toArray(function (err, docs) {
                err ? reject(err) : resolve(docs);
            });
    })
}


// update - deposit/withdraw amount
function update(email, amount) {
    return new Promise((resolve, reject) => {
        const userCollection = db
            .collection('users')
            .findOneAndUpdate(
                { email: email },
                { $inc: { balance: amount } },
                { returnOriginal: false },
                function (err, documents) {
                    err ? reject(err) : resolve(documents);
                }
            );


    });
}

// return all users by using the collection.find method
function alldata() {
    return new Promise((resolve, reject)=>{
        const userCollection = db
            .collection('users')
            .find({})
            .toArray(function(err, docs){
                err ? reject(err) : resolve(docs);
            });
    })
}


export { create, find, update, alldata };
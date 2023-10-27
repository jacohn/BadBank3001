import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { create, find, update, alldata } from './dal.js'
import bodyParser from 'body-parser';



const app = express();

const allowedOrigins =["http://localhost:3000"];
app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin)===-1){
            var msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json()); 
// app.use(authenticate);
app.use(express.static('public'));


//create user account
app.post('/account/create', async (req, res)=>{
    const {name, email, password} = req.body; 
    //destructuring from request body
  
if(!name || !email || !password){
    return res.status(400).json({message: 'All fields are required'});
}

    try { 
      const users = await find(email);
      if(users.length>0){
        return res.status(400).json({message: 'User already exists'})
      }
  
      const user = await create(name, email, password);
      res.json(user);
    } catch(error){
      res.status(500).json({message: 'Server error', error: error.message}); // Secure general error message
    }
    });
  
  
  app.post('/account/login', async (req, res)=> {
    const {email, password} =req.body;
    
    if(!email || !password){
        return res.status(400).json({message: 'Email and password required'});
    }

    try {
        const user = await find(email);
        if (user.length > 0 && await bcrypt.compare(password, user[0].password)) {
            res.json(user[0]);
        } else {
            res.status(400).json({ message: 'Login Failed, try again' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// find user account
app.get('/account/find/:email', function (req, res) {

    find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});


// update - deposit/withdraw amount
app.put('/account/update',async (req, res)=> {
    const {email, amount}=req.body;
     
    if(!email || !amount) {
        return res.status(400).json({message: 'Email and amount are required'});
    }

    try { 
      const response = await update(email, Number(amount));
      res.json(response);
     } catch (error){
      res.status(500).json({message: 'Server error'}); // General secure message
     }
    });

// all accounts
app.get('/account/all', async (req, res) => {
    try{
        const docs = await all();
        res.json(docs);
    } catch(error){
        res.status(500).json({message: 'Server error', error: error.message}); // non secure error message for a nonsecure api
     }
    });
    

app.get('/account/alldata', async (req, res) => {
    try {
      const docs = await alldata();
      res.json(docs);
    } catch (error){
      res.status(500).json({message: 'Server error', error: error.message}); // non secure error message for a non secure api
    }
    }); 

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Running on port: ' + port);
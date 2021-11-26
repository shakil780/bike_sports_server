const express = require('express')
const { MongoClient, Admin } = require('mongodb');
const app = express()
const port =process.env.PORT|| 5000
const cors= require('cors')
const ObjectId= require ('mongodb').ObjectId
require('dotenv').config()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oetxi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
  try{
    await client.connect();
    const database = client.db("Bike_shop");
    const bikeCollaction= database.collection('bike')
     const userCollation =database.collection('user')
      const reviewCollation= database.collection('review')
      const newUsersCollaction= database.collection('users')
    app.post('/bike',async (req,res)=>{
      const bike= req.body
      const result= await bikeCollaction.insertOne(bike)
       res.json(result)
    })
   
    app.get('/bike',async (req,res)=>{
      const cursor= bikeCollaction.find({})
       const bike = await cursor.toArray()
       res.send(bike)

    })
    app.post('/user',async (req,res)=>{
      const bike= req.body
      const result= await userCollation.insertOne(bike)
       res.json(result)
    })
    app.post('/users',async (req,res)=>{
      const users= req.body
       console.log('hitthin',users);
      const result= await newUsersCollaction.insertOne(users)
       res.json(result)
    })
    app.put('/users/admin',async(req,res)=>{
      const user =req.body;
         console.log('put',user);
        const filter={email:user.email}
        const options = { upsert: true };
         const updateDoc={$set: {role:'admin'} }
         const result= await newUsersCollaction.updateOne(filter,updateDoc,options)
         res.json(result)
    } )
     app.get('/user',async(req,res)=>{
      const cursor= userCollation.find({})
      const order = await cursor.toArray()
      res.send(order)
     })
     app.patch("/user/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const updateDoc = {
        $set: req.body,
      };
      const result = await userCollation.updateOne(filter, updateDoc);
      res.json(result);
    });
    app.get("/users/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await newUsersCollaction.findOne(query)
      res.send(result);
    });
    app.post('/review',async (req,res)=>{
      const bike= req.body
      const result= await reviewCollation.insertOne(bike)
       res.json(result)
    })
    app.get('/bike/:id', async(req,res)=>{
      const id = req.params.id
        console.log(id);
        const qurey = {_id: ObjectId(id)}
        const bike = await bikeCollaction.findOne(qurey)
        console.log(bike);
        res.json(bike) 
    })
    app.get('/user/:email',async (req,res)=>{
       console.log(req.params);
        const qurey ={email:req.params.email}
      const cursor= userCollation.find(qurey)
       const bike = await cursor.toArray()
       res.send(bike)

    })
     
    app.get('/review',async (req,res)=>{
      const cursor= reviewCollation.find({})
       const review = await cursor.toArray()
       res.send(review)

    })
    app.delete('/user/:id',async (req,res)=>{
      const id= req.params.id
      const qurey= {_id: ObjectId(id)}
      const result = await userCollation.deleteOne(qurey);

      res.json(result) 
    })
    app.delete('/bike/:id',async (req,res)=>{
      const id= req.params.id
      const qurey= {_id: ObjectId(id)}
      const result = await bikeCollaction.deleteOne(qurey);

      res.json(result) 
    })
  }
  finally{

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;



const corsOption = {
  origin: [
    'http://localhost:5173',
    'https://assignment-12-33727.web.app',
    'https://assignment-12-robiul.netlify.app',
    // 'https://assignment-11-50ae9.web.app',
    // 'https://assignment-11-50ae9.firebaseapp.com'
  ],
  Credentials: true,
  optionSuccessStatus: 200,
}

// middlewere
app.use(cors(corsOption));
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const req = require('express/lib/request');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3nuinge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const surveyCollection = client.db("surveyApp").collection("allSurvey");
    const userCollection = client.db("surveyApp").collection("users");


    // admin api
    app.get('/allUsers', async (req, res) =>{
      const result = await userCollection.find().toArray()
      res.send(result);
    })


    app.put('/userRole/:id', async (req, res) =>{
      const {id} = req.params
      const updateRole = req.body;
      console.log(id, updateRole.role);
      const filter = {_id : new ObjectId(id)}

      const updateDoc = {
        $set: {
          role : updateRole.role,
        },
      };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result)
    })
    
    
    //  user related api
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)

      
      if (existingUser) {
        console.log(existingUser);
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user);

      res.send(result);

    })


    // survey related api
    app.post('/createSurvey', async (req, res) => {
      const surveyData = req.body;
      console.log(surveyData);
      const result = await surveyCollection.insertOne(surveyData);
      res.send(result)
    })


    app.get('/survey', async (req, res) => {
      const result = await surveyCollection.find().toArray()
      res.send(result)
    })

    //  update survey
    app.put('/updateSurvey/:id', async (req, res) => {
      const id = req.params.id;
      const updatedSurvey = req.body

      console.log(updatedSurvey, id);
      const filter = { _id: new ObjectId(id) };


      const updateDoc = {
        $set: {
          title: updatedSurvey.title,
          category: updatedSurvey.category,
          description: updatedSurvey.description,
          deadline: updatedSurvey.deadline,
        },
      };

      const result = await surveyCollection.updateOne(filter, updateDoc)
      res.send(result)
    })


    app.put(`/surveyAnswer/:id`, async (req, res) =>{
      const id = req.params.id;
      const answer = req.body;
      
      const question1Ans = answer.question1Ans;
      const question2Ans = answer.question2Ans;
      const question3Ans = answer.question3Ans;
      console.log(answer, id, question1Ans, question2Ans, question3Ans);

      const filter = { _id: new ObjectId(id) };
      
      const updateDoc = {

        $inc : {
          'question.question_1.question1Ans.yes' : question1Ans === 'yes' ? 1 : 0,
          'question.question_1.question1Ans.no' : question1Ans === 'no' ? 1 : 0,
          'question.question_2.question2Ans.yes' : question2Ans === 'yes' ? 1 : 0,
          'question.question_2.question2Ans.no' : question2Ans === 'no' ? 1 : 0,
          'question.question_3.question3Ans.yes' : question3Ans === 'yes' ? 1 : 0,
          'question.question_3.question3Ans.no' : question3Ans === 'no' ? 1 : 0,
        }
      }
      

      const result = await surveyCollection.updateOne(filter, updateDoc)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('surver is running')
});


app.listen(port, () => {
  console.log(`surver is running on port ${port}`)
})
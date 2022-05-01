const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// user : dbuser1
// password : VEuKuLTxIbc3ggy4

const uri =
  "mongodb+srv://dbuser1:VEuKuLTxIbc3ggy4@cluster0.rligl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    // const database = client.db("insertDB");
    // const haiku = database.collection("haiku");
    const userCollection = client.db("foodExpress").collection("user");

    //get user
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // create a document to insert
    //    const user = {
    //     name: "bk", email: "bk123@gmail.com"
    //   }

    //POST user : add a new user
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("adding new user", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //DELETE a users
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // console.log(
    //   `A document was inserted with the _id bk: ${result.insertedId}`
    // );
  } finally {
    //await client.close();
  }
}

run().catch(console.dir);

// client.connect((err) => {
//   const collection = client.db("foodExpress").collection("users");
//   // perform actions on the collection object
//   console.log("db connected");
//   client.close();
// });

// use middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("running my node curd server");
});

app.listen(port, () => {
  console.log("curd server is running");
});

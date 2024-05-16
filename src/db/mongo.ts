const { MongoClient, ServerApiVersion } = require("mongodb");

const ConnectToDatabase = async (uri: string) => {
  let client;

  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return client.db("cluster0");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default ConnectToDatabase;

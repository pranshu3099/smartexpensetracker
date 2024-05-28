import ConnectToDatabase from "../db/mongo";
const uri = process.env.MONGO_CONNECTION_STRING;
let db: any;
async function connectDatabase() {
  db = await ConnectToDatabase(uri || "");
}

connectDatabase();

export const getDb = () => {
  return db;
};

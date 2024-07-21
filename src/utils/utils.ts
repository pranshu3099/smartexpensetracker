import { getDb } from "../db/connection";

const yourExpenseData = async (email: string) => {
  const db = getDb();
  const userCollection = db.collection("expense");
  const getData = await userCollection.find({ email }).toArray();
  return getData;
};

const getUser = async (email: string) => {
  const db = getDb();

  const userCollection = db.collection("users");
  const existingUser = await userCollection.findOne({ email });
  return existingUser;
};

export default { yourExpenseData, getUser };

import { getDb } from "../db/connection";

const yourExpenseData = async (email: string) => {
  const db = getDb();
  const userCollection = db.collection("expense");
  const getData = await userCollection.find({ email }).toArray();
  return getData;
};

const getUser = async (email: string, user_id: object) => {
  const db = getDb();
  const userCollection = db.collection("users");
  let existingUser = [];
  if (email.length) {
    existingUser = await userCollection.findOne({ email });
  } else {
    existingUser = await userCollection.findOne(user_id);
  }
  return existingUser;
};

export default { yourExpenseData, getUser };

import { db, YAYTSOS } from "../firebase";

export const fetchUserYaytsos = (userId: string) => {
  return db.collection(YAYTSOS).where("uid", "==", userId).get();
};

export const fetchYaytso = (metaCID: string) =>
  db.collection(YAYTSOS).doc(metaCID).get();

export const subscribeToYaytso = (
  metaCID: string,
  callback: (metadata: any) => void
) =>
  db
    .collection(YAYTSOS)
    .doc(metaCID)
    .onSnapshot((doc) => {
      callback(doc.data());
    });

export const updateYaytso = (metaCID: string, params: any) => {
  return db
    .collection(YAYTSOS)
    .doc(metaCID)
    .update(params)
    .then(console.log)
    .catch(console.log);
};

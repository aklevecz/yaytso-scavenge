import { db, YAYTSOS } from "../firebase";
export const fetchUserYaytsos = (userId: string) => {
  return db.collection(YAYTSOS).where("uid", "==", userId).get();
};

export const updateYaytso = (metaCID:string, params:any) => {
  console.log(metaCID, params)
  return db.collection(YAYTSOS).doc(metaCID).update(params).then(console.log).catch(console.log)
}
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const addDocu = (colName, dataObject, thenFunc) => {
  const colRef = collection(db, colName);
  addDoc(colRef, { ...dataObject, createdAt: serverTimestamp() })
    .then(() => thenFunc)
    .catch(err => err.massage);
};

export const updateDocu = (colName, id, dataObject, thenFunc) => {
  const docRef = doc(db, colName, id);

  updateDoc(docRef, dataObject)
    .then(() => thenFunc)
    .catch(err => err.massage);
};

export const deleteDocu = (colName, id, thenFunc) => {
  const docRef = doc(db, colName, id);

  deleteDoc(docRef)
    .then(() => thenFunc)
    .catch(err => err.massage);
};

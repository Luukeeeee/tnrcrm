import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const snapShot = (colName, setState, order, desc = false) => {
  const q = query(collection(db, colName), orderBy(order, desc ? 'desc' : 'asc'));
  onSnapshot(q, snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        setState(pre => [...pre, { ...change.doc.data(), id: change.doc.id }]);
      }
      if (change.type === 'modified') {
        setState(pre => {
          const arr = pre.filter(doc => doc.id !== change.doc.id);
          return [...arr, { ...change.doc.data(), id: change.doc.id }];
        });
      }
      if (change.type === 'removed') {
        setState(pre => {
          const arr = pre.filter(doc => doc.id !== change.doc.id);
          return [...arr];
        });
      }
    });
  });
};

export default snapShot;

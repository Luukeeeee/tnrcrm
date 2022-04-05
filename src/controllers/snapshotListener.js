import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// eslint-disable-next-line import/no-anonymous-default-export
export default (colName, setState) => {
  onSnapshot(collection(db, colName), snapshot => {
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

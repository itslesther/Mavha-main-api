import * as admin from "firebase-admin";
import Shared from '../shared/shared';
import environment from "environments/environment";

const shared = new Shared();

export default class Tasks {

  newTask(
    creator: string = null,
    title: string = '',
    dueDate: number = null,
    priority: 1 | 2 | 3 = null,
    description: string = '',
    files: {
      name: string;
      url: string;
      path?: string;
    }[] = []
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = admin.firestore();
        const batch =  db.batch();

        const taskId = shared.generateId();

        batch.set(db.doc(`tasks/${taskId}`), {
          id: taskId,
          creator,
          title,
          dueDate,
          priority,
          description,
          completed: false,
          creationTS: Date.now(),
          files
        });

        await batch.commit();
        resolve(taskId);
        
      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }


  updateTask(
    taskId: string,
    title: string,
    dueDate: number,
    priority: 1 | 2 | 3,
    description: string,
    // completed: boolean,
    files: {
      name: string;
      url: string;
    }[]
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = admin.firestore();
        const batch = db.batch();

        batch.update(db.doc(`tasks/${taskId}`), {
          title,
          dueDate,
          priority,
          description,
          // completed,
          files,
        });

        await batch.commit();
        resolve();
        
      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }

  deleteTask(taskId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = admin.firestore();
        const batch = db.batch();

        batch.delete(db.doc(`tasks/${taskId}`));

        await batch.commit();
        resolve();

      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }



  getTasks(
    filter: {
      limit: string,
      startAfter: string,
      creator: string,
      priority: '1' | '2' | '3',
      completed: string,
      sortBy: string,
      direction: 'desc' | 'asc'
    }
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(filter);
        const db = admin.firestore();
        let snapshot: FirebaseFirestore.QuerySnapshot;

        let ref: FirebaseFirestore.Query = db.collection('tasks');

        if(filter.creator) ref = ref.where('creator','==',filter.creator);
        if(filter.priority) ref = ref.where('priority','==',+filter.priority);
        if(filter.completed) ref = ref.where('completed','==',eval(filter.completed)); //AVOID OTHER FALSY VALUES
        if(filter.sortBy && (!filter.priority || filter.sortBy !== 'priority')) ref = ref.orderBy(filter.sortBy, filter.direction)
        else ref = ref.orderBy('creationTS', 'desc');
        if(!filter.startAfter) snapshot = await ref.limit(+filter.limit).get();
        else  {
          const doc = await db.doc(`tasks/${filter.startAfter}`).get();
          snapshot = await ref.startAfter(doc).limit(+filter.limit).get();
        }

        const tasks = snapshot.docs.map(doc => doc.data());

        resolve(tasks);
          
      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }

  getTask(taskId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = admin.firestore();

        const task = (await db.doc(`tasks/${taskId}`).get()).data();

        resolve(task);
          
      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }


  uploadDocument(path: string, fileName: string) {
    return new Promise(async (resolve, reject) => {
      try {

        const destination = `tasks/${fileName}`;
        const url = await shared.newFile(path, destination);

        resolve({path: destination, url});
        
      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }

  deleteDocument(path: string) {
    return new Promise(async (resolve, reject) => {
      try {

        await shared.deleteFiles([path]);
        resolve();
        
      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }

  updateTaskStatus(taskId: string, completed: boolean) {
    return new Promise(async (resolve, reject) => {
      try {

        const db = admin.firestore();
        const batch = db.batch();

        batch.update(db.doc(`tasks/${taskId}`), {completed});

        await batch.commit();
        resolve();
        
      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }





}
import * as admin from "firebase-admin";
import Shared from '../shared/shared';
import environment from "environments/environment";

const shared = new Shared();

export default class Tasks {

  newTask(
    creator: string,
    title: string,
    dueDate: number,
    priority: 1 | 2 | 3,
    description: string,
    files: {
      name: string;
      url: string;
      path?: string;
    }[]
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
    priority: 'low' | 'medium' | 'high',
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



  getTasks() {
    return new Promise(async (resolve, reject) => {
      try {
        const db = admin.firestore();

        const tasks = (await db.collection('tasks').orderBy('creationTS','desc').get()).docs.map(doc => doc.data());

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





}
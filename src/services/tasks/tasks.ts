import * as admin from "firebase-admin";
import Shared from '../shared/shared';
import environment from "environments/environment";

const shared = new Shared();

export default class Tasks {

  newTask(
    creator: string,
    title: string,
    dueDate: number,
    priority: 'low' | 'medium' | 'high',
    description: string,
    files: {
      name: string;
      url: string;
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
    completed: boolean,
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
          completed,
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

        const bucket = admin.storage().bucket();

        await bucket.upload(path, {
          public: true,
          destination: `tasks/${fileName}`,
          // Support for HTTP requests made with `Accept-Encoding: gzip`
          // gzip: true,
          // By setting the option `destination`, you can change the name of the
          // object you are uploading to a bucket.
          // metadata: {
          //   // Enable long-lived HTTP caching headers
          //   // Use only if the contents of the file will never change
          //   // (If the contents will change, use cacheControl: 'no-cache')
          //   cacheControl: 'public, max-age=31536000',
          // },
        });
        resolve({path: `tasks/${fileName}`, url: `https://storage.googleapis.com/${bucket.name}/tasks/${fileName}`});
        
      } catch (err) {
        console.log(err);
        reject('anErrorHasOccured');
      }
    });
  }





}
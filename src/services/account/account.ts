import * as admin from "firebase-admin";


export default class account {

  createAccount(firstName: string, lastName: string, email: string, password: string): Promise<void>{
    return new Promise(async (resolve, reject)=>{

      const db = admin.firestore();
      const batch = db.batch();
      
      admin.auth().createUser({email, password}).then(async firebaseUser => {
        try {
          batch.set(db.doc(`users/${firebaseUser.uid}`), {
            id: firebaseUser.uid,
            firstName,
            lastName,
            email: email.toLowerCase(),
            creationTS: Date.now(),
            status: {
              banned: false
            }
          });

          await batch.commit();
          resolve();

        } catch (err) {
          console.log(err);
          reject('anErrorHasOccured');
        }
        
      }).catch(err => {
        console.log(err);
        if(err.code === 'auth/invalid-email'){ reject('invalidEmailFormat'); return; }
        if(err.code === 'auth/invalid-password'){ reject('invalidPasswordFormat'); return; }
        if(err.code === 'auth/email-already-exists'){ reject('emailAlreadyExists'); return; }
        reject('anErrorHasOccured'); return;
      });
    });
  }



}
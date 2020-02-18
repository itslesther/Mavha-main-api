import * as admin from "firebase-admin";

export default class shared {

  async verifyIdToken(req, res, next){
    const token = req.get('authorization');

    if (!token) {
      res.send({success: false, data: null, error: {code: 'NoTokenProvided'}});
      return;
    }

    try {
      const claims = (await admin.auth().verifyIdToken(token));
      res.locals.uid = claims.uid;
      res.locals.role = claims.role;
      next();

    } catch (err) {
      res.send({success: false, data: null, error: {code: 'ErrorVerifyingId'}});
    }

  }

  
  capitalize(value: string){
		return value.charAt(0).toUpperCase() + value.slice(1);
  }

  generateId(){
    return admin.firestore().collection('uniqueId').doc().id;
  }


  fieldsNotEmpty(...fields: string[]){
    for(let field of fields){
      if(!field || !field.trim()) return false;
    }
    return true;
  }


  deleteFiles(files: string[]){
    const bucket = admin.storage().bucket();
    let arrayOfPromises = [];
    for(let file of files){
        arrayOfPromises.push(bucket.file(file).delete());
    }
    // let [res] = await bucket.getFiles({prefix:'users/Mijuj20TzOWaHpAkDutAoVVFzRI2/propertyListing/images'});
    //await bucket.deleteFiles({prefix:'users/Mijuj20TzOWaHpAkDutAoVVFzRI2/propertyListing/images'});
    return Promise.all(arrayOfPromises);
  }

  async newFile(path: string, destination: string) {
    const bucket = admin.storage().bucket();

    await bucket.upload(path, {
      public: true,
      destination,
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
    
    return `https://storage.googleapis.com/${bucket.name}/${destination}`;
  }


  
}
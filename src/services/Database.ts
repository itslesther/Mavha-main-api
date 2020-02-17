import * as admin from "firebase-admin";
import environment from '../environments/environment';

export class Database {

	public init() {
		admin.initializeApp({
			credential: admin.credential.cert(environment.firebaseConfig.credential),
			databaseURL: environment.firebaseConfig.databaseURL,
			storageBucket: environment.firebaseConfig.storageBucket
		});
	}

}
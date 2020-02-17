const environment = {
    mainAppURL:'https://mavha-test.web.app',
    firebaseConfig: { /* Firebase config */
      credential: require('../../serviceAccountKey.json'),
      databaseURL: 'https://mavha-test.firebaseio.com',
      credentialPath: './serviceAccountKey.json',
      storageBucket: "mavha-test.appspot.com"
    }
  }
  
  
  
  export default environment;
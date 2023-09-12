let firebaseConfig = {
    apiKey: "AIzaSyAzL8AO5SVEWPnoCrA5g5k8dYF_CvuujP4",
    authDomain: "selamblog-57158.firebaseapp.com",
    projectId: "selamblog-57158",
    storageBucket: "selamblog-57158.appspot.com",
    messagingSenderId: "324135116957",
    appId: "1:324135116957:web:1447d37d992cc6df76f474"
  };

firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();
let db = firebase.firestore();


const logoutUser = () => {
  auth.signOut();
  location.reload();
}
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAv2JziAv8Ybkcy85asnVYVP968Rzg_URs",
  authDomain: "hrfood-70690.firebaseapp.com",
  projectId: "hrfood-70690",
  storageBucket: "hrfood-70690.firebasestorage.app",
  messagingSenderId: "609272116882",
  appId: "1:609272116882:web:ca4138557247dea14dd84b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();



export  { auth, provider };
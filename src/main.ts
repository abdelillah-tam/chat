import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set} from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBy_ShNxJDybd_kvZ4wqdxJ1iVC2R9wIhg",
  authDomain: "feedmedia-572e2.firebaseapp.com",
  databaseURL: "https://feedmedia-572e2-default-rtdb.firebaseio.com",
  projectId: "feedmedia-572e2",
  storageBucket: "feedmedia-572e2.appspot.com",
  messagingSenderId: "789596897667",
  appId: "1:789596897667:web:fe8593743ffc090a0d76b6",
  measurementId: "G-64Q5CTX4JS"
};

initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
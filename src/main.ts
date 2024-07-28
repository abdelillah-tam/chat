import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set} from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBaRYK1qyGrBi17GTypMzXGc5-vhC3HfBc",
  authDomain: "chat-e5d4f.firebaseapp.com",
  projectId: "chat-e5d4f",
  storageBucket: "chat-e5d4f.appspot.com",
  messagingSenderId: "841961552150",
  appId: "1:841961552150:web:d2639c5f872acf76e73837",
  databaseURL: "https://chat-e5d4f-default-rtdb.europe-west1.firebasedatabase.app"
};

initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
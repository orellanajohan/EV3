import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "project-4865191128908323249.firebaseapp.com",
    projectId: "project-4865191128908323249",
    storageBucket: "project-4865191128908323249.appspot.com",
    messagingSenderId: "777182492284",
    appId: "1:777182492284:web:6df1f513d6078f8b467bf9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const save = (estudiantes) => addDoc(collection(db, 'estudiantes'), estudiantes);

export const getData = (data) => onSnapshot(collection(db, 'estudiantes'), data);

export const remove = (id) => deleteDoc(doc(db, 'estudiantes', id));

export const selectOne = (id) => getDoc(doc(db, 'estudiantes', id));

export const edit = (id, estudiantes) => updateDoc(doc(db, 'estudiantes', id), estudiantes);

export const runExists = (run) => {
    const q = query(collection(db, "estudiantes"), where("run", "==", run));
    return getDocs(q).then((querySnapshot) => !querySnapshot.empty);
};

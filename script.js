import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAc6MUEav7H7Y-t1H5G3diAXiQHPFpTkrA",
  authDomain: "sarhad-dimension.firebaseapp.com",
  projectId: "sarhad-dimension",
  storageBucket: "sarhad-dimension.firebasestorage.app",
  messagingSenderId: "363344322133",
  appId: "1:363344322133:web:92f5b4f87f2efa13f8bedc",
  measurementId: "G-5FMPK3QWBZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 EVENT SELECT
window.selectEvent = function(eventName) {
    localStorage.setItem("selectedEvent", eventName);
    window.location.href = "register.html";
};

document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("registrationForm");

// AUTO SELECT EVENT
const savedEvent = localStorage.getItem("selectedEvent");
if (savedEvent) {
    document.getElementById("event").value = savedEvent;
}

if(!form) return;

form.addEventListener("submit", async (e) => {

e.preventDefault();

const name = document.getElementById("name").value;
const college = document.getElementById("college").value;
const phone = document.getElementById("phone").value;
const event = document.getElementById("event").value;
const payment = document.getElementById("paymentMethod").value;

if (!name || !college || !phone || !event || !payment) {
    alert("Fill all fields");
    return;
}

await addDoc(collection(db,"registrations"),{
name,
phone,
college,
event,
paymentMethod: payment,
status: payment === "Cash" ? "Pending" : "Paid"
});

alert("Registered!");

// CASH
if (payment === "Cash") {
    alert("Pay cash to volunteer");
    return;
}

// UPI PAYMENT
let amount = 0;

if(event === "Coding Competition") amount = 100;
if(event === "Robotics Workshop") amount = 150;
if(event === "Gaming Tournament") amount = 50;
if(event === "Hackathon") amount = 200;

const upiID = "pratikhanamghar156-1@oksbi";

const upiLink = `upi://pay?pa=${upiID}&pn=SarhadDimension&am=${amount}&cu=INR`;

// 📱 MOBILE → OPEN UPI APP
if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    window.location.href = upiLink;
} 
// 💻 DESKTOP → SHOW QR
else {
    document.getElementById("qrBox").style.display = "block";

    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
    
    document.getElementById("qrImage").src = qrURL;
}

});

});
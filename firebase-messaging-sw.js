const firebaseConfig = {
  apiKey: "AIzaSyBcTsdNM48Ts1t5JTNdDby8281e7s7REDE",
  authDomain: "simforum-login.firebaseapp.com",
  databaseURL: "https://simforum-login-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "simforum-login",
  storageBucket: "simforum-login.appspot.com",
  messagingSenderId: "311465979099",
  appId: "1:311465979099:web:8ded10990bee13bfb770fe",
  measurementId: "G-WP0XZT3CHT"
};
// BIAR GA KELAMAAN PAS MAU PANGGIL NANTI
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
    // Customize notification here
    const notificationTitle = "Notification Title";
    const notificationOptions = {
      body: " Body Text",
      icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhI0Lu6jntvJUWy37rQlbrKVu9X-kHuLOuj0CUkhhdv7TtLcPlpfsab85uDEM0b6zN2tNY9gd1xHrkR08h3ZGFgRC_9a2TNLYypfT4yoXldbKVbIHk8nXgwyXvHYecvcR7egsABhhlzZjNVW12bZM4XPtRZUWY0jREnFalCpocvvc7DpH_PGR26BH0SrlI5/s1600/image.jpg"
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
});

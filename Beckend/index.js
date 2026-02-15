const express = require('express');
const multer = require("multer");
const mongoose = require("mongoose");
const authController = require('./controllers/authController');
const budgetController = require('./controllers/budgetController');
const gamificationController = require('./controllers/gamificationController');
const notesController = require('./controllers/notesController');
const notificationController = require('./controllers/notificationController');
const studyController = require('./controllers/studyController');
const ProfilePhoto=require('./controllers/ProfilePhotoController');
const auth = require("./middleware/auth");
const path = require("path");

require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});



const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get('/', (req, res) => {
  res.send("App is working");
});

app.post('/login', authController.Login);
app.post('/register', authController.Register);
app.put('/user/:id', authController.UpdateUser);
app.post("/forgot-password", authController.ForgotPassword);
app.post("/reset-password", authController.ResetPassword);
app.post('/uploadphoto',auth, upload.single("photo"),ProfilePhoto.UploadPhoto)
app.get('/get-photo/:id',auth,ProfilePhoto.GetPhoto);
app.delete('/delete-photo/:id',auth,ProfilePhoto.DeletePhoto);

app.post('/addExpense', auth, budgetController.addExpense);
app.get('/getExpense', auth, budgetController.getExpenses);
app.get("/getBudget", auth, budgetController.getBudget);
app.post("/setBudget", auth, budgetController.setBudget);
app.delete("/reset",auth,budgetController.resetMonth);

app.get('/getAchievements', auth, gamificationController.getAchievements);
app.get("/progress", auth, gamificationController.getProgress);
app.post('/addAchievement', auth, gamificationController.addAchievement);

app.post('/addNote', auth, upload.single("file"),  notesController.addNote);
app.get('/getNotes', auth, notesController.getNotes);
app.put('/updateNote/:id', auth, upload.single("file"),  notesController.updateNote);
app.delete('/deleteNote/:id', auth, notesController.deleteNote);

app.post('/addTask', auth, studyController.addTask);
app.get('/getTasks', auth, studyController.getTasks);
app.put('/updateTask/:id', auth, studyController.updateTask);
app.delete('/deleteTask/:id', auth, studyController.deleteTask);

app.get("/getnotification", auth, notificationController.getNotifications);
app.put("/:id/read", auth, notificationController.markAsRead);
app.delete('/deleteNotification',auth,notificationController.deleteNotification)

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

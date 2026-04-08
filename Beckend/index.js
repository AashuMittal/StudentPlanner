require("dotenv").config();

const express = require('express');
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authController = require('./controllers/authController');
const budgetController = require('./controllers/budgetController');
const gamificationController = require('./controllers/gamificationController');
const notesController = require('./controllers/notesController');
const notificationController = require('./controllers/notificationController');
const studyController = require('./controllers/studyController');
const ProfilePhoto=require('./controllers/ProfilePhotoController');
const aiController = require('./controllers/aiController');
const auth = require("./middleware/auth");
const paymentController = require("./controllers/paymentController");
const reminderScheduler = require("./services/reminderScheduler");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/studentbudget";

console.log("MongoDB URI:", MONGO_URI ? MONGO_URI.substring(0, 30) + "..." : "NOT SET");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    
    reminderScheduler.start();

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });


const noteStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const noteUpload = multer({ storage: noteStorage });

const profileStorage = multer.diskStorage({
  destination: "uploads/profile/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: profileStorage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get('/', (req, res) => {
  res.send("App is working");
});

app.post("/register", authController.Register);
app.post("/verify-otp", authController.verifyOtp);
app.post("/login", authController.Login);
app.post("/refresh-token", authController.refreshToken);
app.put('/user/:id', authController.UpdateUser);
app.post("/forgot-password", authController.ForgotPassword);
app.post("/reset-password", authController.ResetPassword);
app.post('/uploadphoto',auth, upload.single("photo"),ProfilePhoto.UploadPhoto)
app.delete('/deletephoto',auth,ProfilePhoto.DeletePhoto);

app.post('/addExpense', auth, budgetController.addExpense);
app.get('/getExpense', auth, budgetController.getExpenses);
app.get("/getBudget", auth, budgetController.getBudget);
app.post("/setBudget", auth, budgetController.setBudget);
app.delete("/reset",auth,budgetController.resetMonth);

app.get('/getAchievements', auth, gamificationController.getAchievements);
app.get("/progress", auth, gamificationController.getProgress);
app.post('/addAchievement', auth, gamificationController.addAchievement);

app.post('/addNote', auth, noteUpload.single("file"),  notesController.addNote);
app.get('/getNotes', auth, notesController.getNotes);
app.put('/updateNote/:id', auth, noteUpload.single("file"),  notesController.updateNote);
app.delete('/deleteNote/:id', auth, notesController.deleteNote);

app.post('/addTask', auth, studyController.addTask);
app.get('/getTasks', auth, studyController.getTasks);
app.put('/updateTask/:id', auth, studyController.updateTask);
app.post('/completeTask/:id', auth, studyController.completeTask);
app.delete('/deleteTask/:id', auth, studyController.deleteTask);

app.get("/getnotification", auth, notificationController.getNotifications);
app.put("/:id/read", auth, notificationController.markAsRead);
app.delete('/deleteNotification',auth,notificationController.deleteNotification)

app.post("/ai/generate-quiz", auth, aiController.generateQuiz);
app.post("/ai/generate-assignment", auth, aiController.generateAssignment);
app.post("/ai/regenerate-quiz", auth, aiController.regenerateQuiz);
app.post("/ai/regenerate-assignment", auth, aiController.regenerateAssignment);
app.post("/ai/quiz/:id/submit", auth, aiController.submitQuiz);
app.get("/ai/quiz-history", auth, aiController.getQuizHistory);
app.get("/ai/assignments", auth, aiController.getAssignments);
app.put("/ai/assignments/:id", auth, aiController.updateAssignmentStatus);
app.get("/ai/suggestions", auth, aiController.getStudySuggestions);
app.get("/ai/prediction", auth, aiController.getPerformancePrediction);
app.get("/ai/analytics", auth, aiController.getAnalytics);

app.post("/ai/reminders", auth, aiController.createReminder);
app.get("/ai/reminders", auth, aiController.getReminders);
app.put("/ai/reminders/:id", auth, aiController.updateReminder);
app.delete("/ai/reminders/:id", auth, aiController.deleteReminder);
app.get("/ai/reminder-preferences", auth, aiController.getReminderPreferences);
app.put("/ai/reminder-preferences", auth, aiController.updateReminderPreferences);

app.post("/create-order", auth, paymentController.createOrder);
app.post("/verify", auth, paymentController.verifyPayment);
app.post("/fakepremium", auth, paymentController.fakePremium);

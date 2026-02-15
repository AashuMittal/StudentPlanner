const BASE_URL = "http://localhost:5000";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const RegisterUser = async ({ name, email, password }) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

export const LoginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const UpdateUser = async ({ name, email, password, userId }) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

export const PhotoUpload = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch(`${BASE_URL}/uploadphoto`, {
    method: "POST",
    headers: {
      ...authHeader(),
    },
    body: formData,
  });

  return res.json();
};

export const GetPhoto = (id) => {
  return `${BASE_URL}/get-photo/${id}`;
};

export const DeletePhoto = async (id) => {
  const res = await fetch(`${BASE_URL}/delete-photo/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
};

export const ForgotPasswordApi = async (email) => {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const AddExpense = async (expense) => {
  const res = await fetch(`${BASE_URL}/addExpense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(expense),
  });
  return res.json();
};

export const GetExpenses = async () => {
  const res = await fetch(`${BASE_URL}/getExpense`, {
    headers: authHeader(),
  });
  return res.json();
};

export const GetBudget = async () => {
  const res = await fetch(`${BASE_URL}/getBudget`, {
    headers: authHeader(),
  });
  return res.json();
};

export const SetBudget = async (amount) => {
  const res = await fetch(`${BASE_URL}/setBudget`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ totalAmount: amount }),
  });
  return res.json();
};

export const ResetBudget = async () => {
  const res = await fetch(`${BASE_URL}/reset`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
};

export const GetAchievements = async () => {
  const res = await fetch(`${BASE_URL}/getAchievements`, {
    headers: authHeader(),
  });
  return res.json();
};

export const AddAchievement = async (achievement) => {
  const res = await fetch(`${BASE_URL}/addAchievement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(achievement),
  });
  return res.json();
};

export const GetProgress = async () => {
  const res = await fetch(`${BASE_URL}/progress`, {
    headers: authHeader(),
  });
  return res.json();
};

export const GetNotes = async () => {
  const res = await fetch(`${BASE_URL}/getNotes`, {
    headers: authHeader(),
  });
  return res.json();
};

export const AddNote = async (note) => {
  const res = await fetch(`${BASE_URL}/addNote`, {
    method: "POST",
    headers: {
      ...authHeader(),
    },
    body: note,
  });
  return res.json();
};

export const UpdateNote = async (id, note) => {
  const res = await fetch(`${BASE_URL}/updateNote/${id}`, {
    method: "PUT",
    headers: {
      ...authHeader(),
    },
    body:note,
  });
  return res.json();
};

export const DeleteNote = async (id) => {
  const res = await fetch(`${BASE_URL}/deleteNote/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
};

export const AddTask = async (task) => {
  const res = await fetch(`${BASE_URL}/addTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(task),
  });
  return res.json();
};

export const GetTasks = async () => {
  const res = await fetch(`${BASE_URL}/getTasks`, {
    headers: authHeader(),
  });
  return res.json();
};

export const UpdateTask = async (id, task) => {
  const res = await fetch(`${BASE_URL}/updateTask/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(task),
  });
  return res.json();
};

export const DeleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/deleteTask/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
};

export const GetNotifications = async () => {
  const res = await fetch(`${BASE_URL}/getnotification`, {
    headers: authHeader(),
  });
  return res.json();
};

export const MarkNotificationRead = async (id) => {
  await fetch(`${BASE_URL}/${id}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });
};


export const ClearAllNotifications= async () => {
  const res = await fetch(`${BASE_URL}/deleteNotification`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
};
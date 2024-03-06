const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5123;

const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}));
app.use(cors());
app.use(express.json());
app.post("/registerOnline", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or phone number already registered' });
    }
    const user = new User({
      name,
      email,
      phone,
      password, 
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/registerOffline", async (req, res) => {
  try {
    const offlineData = req.body;
    for (const data of offlineData) {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        continue;
      }
      const user = new User({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password, 
      });
      await user.save();
    }
    res.status(200).json({ message: "Offline data synchronized successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect('mongodb+srv://hari:hari@cluster0.hsmpfuf.mongodb.net/zarektonix?retryWrites=true&w=majority&appName=Cluster0',
 { useNewUrlParser: true, useUnifiedTopology: true })

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

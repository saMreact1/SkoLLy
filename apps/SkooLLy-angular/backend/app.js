const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/teachers', require('./routes/teacher.routes'));
app.use('/students', require('./routes/student.routes'));
app.use('/schools', require('./routes/school.routes'));
app.use('/classes', require('./routes/class.routes'));
app.use('/notices', require('./routes/notice.routes'));
app.use('/subjects', require('./routes/subject.routes'));
app.use('/timetable', require('./routes/timetable.routes'));


app.get('/', (req, res) => res.send('🌍 Skoolly API up & running!'));



module.exports = app;
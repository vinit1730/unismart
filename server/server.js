// ... (your existing code above)

// API Endpoints Mount
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

app.use('/api/v1/ai', aiRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected', 
    server: 'Running' 
  });
});

// ADD THIS NEW ROOT ROUTE HERE 👇
app.get('/', (req, res) => {
  res.send('Unismart Server is up and running successfully!');
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB cluster connected successfully.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection crash:', err));
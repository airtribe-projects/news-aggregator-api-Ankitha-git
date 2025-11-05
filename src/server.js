const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║   News Aggregator API Server Started     ║
  ╠═══════════════════════════════════════════╣
  ║   Port: ${PORT}                              ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}               ║
  ║   Time: ${new Date().toLocaleString()}   ║
  ╚═══════════════════════════════════════════╝
  
  📡 Server is running on http://localhost:${PORT}
  📚 API Documentation: http://localhost:${PORT}/api/docs
  💚 Health Check: http://localhost:${PORT}/api/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server and exit process
  process.exit(1);
});
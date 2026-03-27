import { app } from './app.js';
import { createServer } from 'http';
import { setupSocket } from './socket/index.js';
import dotenv from 'dotenv';

dotenv.config();

const server = createServer(app);
const io = setupSocket(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export { io };

// src/server.ts
import dotenv from 'dotenv';
dotenv.config(); // <--- Must be BEFORE other imports

// Now import the app (which loads the AI service)
import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`TaskFlow server running on port ${PORT}`);
});
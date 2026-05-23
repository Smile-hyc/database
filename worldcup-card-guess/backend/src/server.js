import app from "./app.js";
import { pingDatabase } from "./db.js";

const port = Number(process.env.PORT || 3001);

app.listen(port, async () => {
  try {
    await pingDatabase();
    console.log(`API running at http://localhost:${port}`);
    console.log("Database connection OK");
  } catch (error) {
    console.log(`API running at http://localhost:${port}`);
    console.warn("Database connection failed:", error.message);
  }
});

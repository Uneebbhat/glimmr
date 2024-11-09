import app from "./app";
import { PORT } from "./config/constants";

const port = PORT;

app.listen(PORT, () => {
  console.log(`http://localhost:${port}`);
});

// import client from "./config/db.js";
import app from "./app.js";
// import dotenv from 'dotenv';

// dotenv.config();

const PORT = process.env.PORT || '3001';

app.listen(PORT || '3001', () => console.log(`server Started at http://localhost:${PORT}`))


// client.connect()
// .then(() => {
//   app.listen(PORT || '3001', () => console.log(`server Started at http://localhost${PORT}`))
// })
// .catch((err) => {
//   console.log(`Postgress Connection Error ${err}`)
// })

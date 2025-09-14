import sql from "mssql";

const Dbconnection = {
  port: 1433,
  server: "localhost",
  database: "SalesDB",
  user: "sa",
  password: "@Kunal143",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

const connection = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(Dbconnection);
      console.log("✅ Database successfully connected");
    }
    return pool;
  } catch (error) {
    console.error(`❌ Something went wrong: ${error.message}`);
    throw error;
  }
};

export default connection; // if using ES Modules
// module.exports = connection; // if using CommonJS

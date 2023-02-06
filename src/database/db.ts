import { DataSource } from "typeorm";

const connectDB = new DataSource({

  type: "postgres",
  url: process.env.URL_DB_CONNECT,
  logging: true,
  synchronize: true,
  entities: ["./src/entity/**/*.ts"],
})

connectDB
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`);
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  })

export default connectDB;
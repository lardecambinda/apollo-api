import { DataSource } from "typeorm";

const connectDB = new DataSource({

  type: "postgres",
  url: "postgres://apollo:apollo@127.0.0.1:5432/apollo",
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
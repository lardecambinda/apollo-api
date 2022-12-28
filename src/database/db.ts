import { DataSource } from "typeorm";

const connectDB = new DataSource({

  type: "postgres",
  url: "postgres://xfetmhya:2Tl8aVo4SVbt10He58cY0VaHAUb5pbOx@motty.db.elephantsql.com/xfetmhya",
  logging: true,
  synchronize: true,
  entities: ["./src/entity/**/*.ts"],
  cli: {
    entitiesDir: "src/entity"
  },
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
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
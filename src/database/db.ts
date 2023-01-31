import { DataSource } from "typeorm";

const connectDB = new DataSource({

  type: "postgres",
  url: "postgres://ryumbijn:O8SCmPaDN3p_oEnp_eYWnIiRzZz6xsYP@35.198.51.18:5432/ryumbijn",
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
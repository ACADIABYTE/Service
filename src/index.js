const { config } = require("dotenv")
config();

const createApp = require("./utils/createApp")

async function main() {
  console.log(`Running in ${process.env.ENVIRONMENT} mode.`);
  try {
    const app = createApp();

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running as port: ${port}`));
  } catch (err) {
    console.error(err);
  }
}

main();

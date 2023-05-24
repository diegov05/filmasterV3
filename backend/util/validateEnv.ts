import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
    MONGO_DB_CONNECTION_URI: str(),
    PORT: port()
})
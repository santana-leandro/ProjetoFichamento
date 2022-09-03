import dotenv from "dotenv";
dotenv.config();

const conf = {
    banco: {
        host: process.env.CONF_HOST,
        user: process.env.CONF_USER,
        password: process.env.CONF_PASSWORD,
        database: process.env.CONF_DATABASE
    },
    cripto: {
        secret: process.env.CONF_SECRET
    }
};

export default conf;
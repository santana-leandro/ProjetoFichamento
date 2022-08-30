import express from 'express';

const app = express();

export default app.use('/',(req,res) => {
    res.send("Hello World!");
});

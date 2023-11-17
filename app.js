const express = require('express')
const app = express();
const {connectDB} = require('./src/mongoDB/db')
const cookieParser = require('cookie-parser');
const cors = require("cors");
const contactUsRouter =  require('./src/routers/contactUsRouter');
const authRouter = require('./src/routers/authRouter');
const dotenv = require("dotenv")
const bodyParser = require("body-parser")

dotenv.config();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({origin:"*"}));

/* Connecting to Database */
const startServer = async() => {
   const PORT = process.env.PORT || 85585;
   try {
      connectDB(process.env.MONGO_URL,{
         // useNewUrlParser: true,
         // useUnifiedTopology: true
      });
      app.listen(PORT, () => console.log(`Server port: ${PORT}`));
   } catch (error) {
      console.log(error)
   }
};

startServer()

/* Middlewares for parsing data*/
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


/* Routes */
//contactUsRouter
app.use(contactUsRouter);

//authenticatoionRouter(signup and login)
app.use(authRouter);

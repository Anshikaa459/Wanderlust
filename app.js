if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
  // console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME); // debug
}

const express = require('express');
const app = express();
const cloudConfig = require('./cloud_config');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// const {listingSchema,reviewSchema}=require("./schema.js");

const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require('./models/user.js');

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

// EJS setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

// MongoDB connection

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  try {
    mongoose.connect(dbUrl, {
      tls: true,
      ssl: true,
    });
    console.log('✅ MongoDB Atlas Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
  }
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on('error', (err) => {
  console.log('ERROR in MONGO SESSION STORE', err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  // console.log('Current user session:', req.user);
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async(req,res)=>{
//   let fakeUser = new user({
//     email: "student@gamil.com",
//     username: "delta-student",
//   });

//   let registeredUser = await user.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

app.use('/listings', listingsRouter);
app.use('/listings', reviewsRouter);
app.use('/', userRouter);

// Routes

// Root
// app.get("/", (req, res) => {
//   res.send("Server is working");
// });

app.use(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
}); // without double quotes

// Central Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render('error', { err });
});

// Start server
app.listen(8080, () => {
  console.log('App listening on port 8080');
});

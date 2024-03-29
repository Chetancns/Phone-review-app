const express = require('express');
const path = require('path');
const exphbs =require('express-handlebars');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose'); 
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport')

// Load User Model
require('./models/User');
require('./models/phone');


//Passport Config
require('./config/passport')(passport);

//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const phones = require('./routes/phones');

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

// DB Config
const db = require('./config/database');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(db.mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app=express();


// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// MEthod Override Middelware
app.use(methodOverride('_method'));

//Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    formatDate:formatDate,
    select:select,
    editIcon:editIcon
  },
    defaultLayout:'main'
  }));
  app.set('view engine', 'handlebars');  


app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Set global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
  });

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Use Routes
app.use('/',index)
app.use('/auth',auth);
app.use('/phones',phones);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})
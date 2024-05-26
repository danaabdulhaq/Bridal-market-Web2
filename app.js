const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const path  = require('path');
const app = express();
require("dotenv").config();
const port = process.env.PORT 


const appControllers = require("./controllers/appControllers");


mongoose.connect(process.env.DB_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database!"));



const Users = require('./models/userschema')


const home = require('./routes/home/home-routes')
const loginRoutes = require('./routes/Login/Login-routes');
const dashbordRoutes = require('./routes/dashbord/dashbord_routes')
const events =require('./routes/event/event-routes')
const profiles =require("./routes/profiles/profiles_routes");
const loading = require('./routes/sign/loadingpage')
const productpage = require('./routes/productPage/product-route');
const calender1 = require("./routes/calender/calender")
const signupUser = require('./routes/sign/signup-routes')
const signupProvider = require('./routes/sign/signup-routes');
const MaindashbordRoutes = require('./routes/Maindashbord/main_dashbord')
const searchModel = require("./models/Customer")
const Search = require("./models/search")
const ActivationRoutes = require('./routes/maindashboard/activationroute');
const deleteProviderRoutes = require('./routes/maindashboard/deleteproviderroute');
const deleteUserRoutes = require('./routes/maindashboard/deleteuserroute');
const reservationRoutes =require('./routes/reservation/reservation')


app.set('view engine', 'ejs');
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
  
const store = new MongoDBStore({
    uri:process.env.DB_URI,
    collection: 'MYsessions'
    //https://youtube.com/watch?v=TDe7DRYK8vU&si=6UbOY4mMgdKWLvds
});
const sessionCookieLifeTime = 1000 * 60 * 15;
app.use(
    session({
      secret: "Muy8fuSOYHDsR6WOCwNS6K6sy2QmhSEp",
      resave: false,
      saveUninitialized: false,
        cookie: { maxAge: sessionCookieLifeTime },
      store: store,
    })
)
 //https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Faux-sam%2Fnodejs%2Ftree%2Fmain%3Ffbclid%3DIwZXh0bgNhZW0CMTAAAR02TTL2cb_o8e6f52-OIVHe7bwgvnZU8a2eN7OFqlqYu7wwfk2OjfaA1Qs_aem_AaCGS-JRtka59oklW4jKYQOjrF0a6oVXGCxPawjitusRnYtQKsCJGCmFJNNlPrE_I1JlmSfRSW0f98k4N0uEbBAa&h=AT3FQOJsP0dvkfGaFrDlscsxVSgLoPUFwP7MnLZ58DIychTlHsdblw90vGwgZ0ZU227aRIOwQ4XDA3HtcCm9IaTzvbiA9yB8TaTHWToyT9XVgE7TpN-RPxqhSyumYa8Tm5-_-sNLlahUvjU

  app.use((req, res, next) => {
    console.log("Session middleware - Session:", req.session);
    next();
});
app.use('/', home);
app.use('/Login',loginRoutes)
app.use('/dashbord', dashbordRoutes);
app.use('/profiles', profiles);
app.use('/loading', loading);
app.use('/productpage', productpage);
app.use('/eventproduct', events);
app.use('/calender1', calender1);
app.use('/calender2', calender1);
app.use('/signup', signupUser);
app.use('/dashbord', dashbordRoutes);
app.use('/eventproduct', events);
app.use('/updateActivation', ActivationRoutes);
app.use('/deleteProvider', deleteProviderRoutes);
app.use('/deleteUser', deleteUserRoutes);
app.use('/dashbordMain', MaindashbordRoutes);
app.use('/reservationConf', reservationRoutes);
app.use('/reserve', reservationRoutes)


app.use('/signupProvider', signupProvider);
app.get('/eventproduct/:categoryName/:page', (req, res) => {
    const numofpage = parseInt(req.params.page);
    const numofproduct = 6;
    const categoryName = req.params.categoryName;

    Users.countDocuments({
            category: categoryName
        })
        .then(totalProducts => {
            const totalPages = Math.ceil(totalProducts / numofproduct);
            return Users.find({
                    category: categoryName
                })
                .skip((numofpage - 1) * numofproduct)
                .limit(numofproduct)
                .then(authorlist => {
                    res.render('index', {
                        products: authorlist,
                        categoryName: categoryName,
                        currentPage: numofpage,
                        totalPages: totalPages
                    });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Server Error');
        });
});
app.post("/searchPage", (req, res) => {

    console.log(req.body)
    const search = new Search(req.body);
    search.save().then(() => {
        res.redirect("/searchPage")

    }).catch(err => console.error(err));
})
app.get('/searchPage', (req, res) => {
    searchModel.find({})
        .then(search => res.json(search))
        .catch(err => console.error(err));
    console.log(req.body)

});


app.get("/eventproduct", async (req, res) => {
    Users.find()
        .then((result) => {
            res.render("index", {
                products: result
            });
        })
        .catch((err) => {
            console.log(err);
        });
});
app.get("/productpage/productpage/:id", (req, res) => {
    Users.findById(req.params.id)
        .then(product => {
            return Users.find({
                    category: product.category,
                    _id: {
                        $ne: product._id
                    } 
                }).limit(4)
                .then(similarProducts => {
                    res.render("productpage", {
                        product: product,
                        similarProducts: similarProducts
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Server Error');
        });
});


app.use((req, res, next) => {
    res.status(404).send("Sorry, can't find that!");
});

const Provider = require('./routes/maindashboard/models/allproviders');
const User = require('./routes/maindashboard/models/allusers');

app.get('/', (req, res) => {
    res.render('maindashboard')
});
app.get('/allserviceproviders', async (req, res) => {
    const providers = await Provider.find({});
    res.render('allserviceproviders', {
        providers,
        message: null
    });
});
app.get('/allusers', async (req, res) => {
    const users = await User.find({});
    res.render('allusers', {
        users,
        message: null
    });
});



app.listen(process.env.PORT, () => {

    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
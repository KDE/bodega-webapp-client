function isAuthorized(req, res, next)
{
    if (req.session.authorized) {
        next();
    } else {
        console.log("Unauthorized user", req, res);
        res.redirect('/');
    }
}

app.get('/', function(req, res) {
    res.render('home', {
        network: app.config.network
    });
    //res.render('index');
    //res.redirect('/login');
});

app.get('/index', isAuthorized, function(req, res) {
    app.BodegaManager.index(req, res);
});

app.get('/index/test', function(req, res) {
    var categories = [];
    var book = [];
    var wallpaper = [];

    for (var i = 0; i < 6; i++ ) {
        categories[i] = {
            name: 'category ' + i
        };
        book[i] = {
            name: 'book ' + i,
            author: 'author' + i,
            description: 'description ' + i,
            license: 'license ' + i,
            image: app.config.bodega + ":" + app.config.port + '/images/128/default/book.png'
        };
        wallpaper[i] = {
            name: 'wallpaper ' + i,
            image: app.config.bodega + ':' + app.config.port + '/images/128/default/wallpaper.png'
        };
    }

    var channels = [];
    channels[0] = {
        name: 'books',
        cat: categories,
        assets: book
    };
    channels[1] = {
        name: 'wallpapaers',
        assets: wallpaper
    };

    res.render('indextest', {
        network: app.config.network,
        channel: channels
    });
});

//login
app.get('/login', function(req, res) {
    res.render('login', {
        network: app.config.network
    });
});

app.get('/login/info', function(req, res) {
    app.BodegaManager.loginInfo(req, res);
});

app.post('/login', function(req, res){
    app.BodegaManager.login(req, res);
});

app.get('/login/confirm', function(req, res){
    app.BodegaManager.loginconfirm(req, res);
});

//register
app.get('/register', function(req, res) {
    res.render('register', {
        network: app.config.network
    });
});

app.post('/register', function(req, res) {
    app.BodegaManager.register(req, res);
});

app.get('/register/confirm', function(req, res) {
    res.render('registerconfirm', {
        network: app.config.network
    });
});

//account
app.get('/account/modify',isAuthorized, function(req, res) {
    console.log(req.session);
    res.render('accountmodify', {
        firstname: req.session.firstname,
        lastname: req.session.lastname,
        email: req.session.email,
        network: app.config.network
    });
});

app.post('/account/modify', function(req, res) {
    app.BodegaManager.accountmodify(req, res);
});

app.get('/account/modify/confirm',isAuthorized, function(req, res) {
     res.render('accountmodifyconfirm', {
         result: app.operationStatus,
         network: app.config.network
    });
});

app.get('/account', function(req, res) {
    res.redirect('/account/modify');
    //res.render('account');
});

app.get('/account/resetPassword', function(req, res){
    res.render('resetpassword', {
         network: app.config.network
   });
});

app.post('/account/resetPassword', function(req, res){
    app.BodegaManager.resetpassword(req,res);
});

app.get('/account/resetPassword/confirm', function(req, res){
    res.render('resetpasswordconfirm', {
        message: app.operationMessage,
        result: app.operationStatus,
        network: app.config.network
    });
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    delete app.cookie;

    res.redirect('/');
});


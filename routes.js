function isAuthorized(req, res, next)
{
    if (req.session.authorized) {
        next();
    } else {
        console.log("Unauthorized user", req, res);
        res.redirect('/');
    }
}

app.get('/', function(req, res){
    //res.render('index');
    res.redirect('login');
});

//login
app.get('/login', function(req, res) {
    res.render('login', {
        network: app.config.network
    });
})

app.get('/login/info', function(req, res) {
    app.BodegaManager.loginInfo(req, res);
})

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

app.get('/account/modify', function(req, res) {
    res.render('accountmodify', {
        firstname: "name",
        lastname: "lastname",
        email: "email",
        network: app.config.network
    });
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    delete app.cookie;

    res.redirect('/');
});

//acount
app.get('/account', function(req, res) {
    res.render('account');
});


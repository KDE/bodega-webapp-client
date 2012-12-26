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
});

//login
app.get('/login', function(req, res) {
    res.render('login', {
     network: app.config.network
    });
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
    res.render('registerconfirm');
});

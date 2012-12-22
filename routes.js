function isAuthorized(req, res, next)
{
    if (req.session.authorized) {
        next();
    } else {
        console.log("Unauthorized user", req, res);
        res.redirect('/');
    }
}

/*
 * GET home page.
 */
app.get('/', function(req, res){
    //res.render('index');
});

app.get('/login', function(req, res) {
    res.render('login')
})

app.post('/login', function(req, res){
    app.BodegaManager.login(req, res)
    //res.render('index');
});

app.get('/login/confirm', function(req, res){
    app.BodegaManager.loginconfirm(req, res)
    //res.render('index');
});

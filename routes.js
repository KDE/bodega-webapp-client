
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


/*
 * GET home page.
 */

app.get('/login', function(req, res) {
 res.render('login')
})

app.get('/', function(req, res){
  res.render('index');
});


var express = require("express");
var path = require("path");
var app = express();

app.set("view engine", 'ejs'); // express에게 ejs를 view engine로 사용 선언
app.use(express.static(path.join(__dirname,"public")));

//'/' route을 생성하고 '/'에 route에 get신호가 오면 my_first_ejs파일을 render
//5번째 줄에 의해 자동으로 /views 폴더를 검색하고, 확장자가 ejs인 파일을 찾도록 함
app.get('/', function(req,res){
  res.render('my_first_ejs.ejs');
});

app.listen(3000,function(){
  console.log('Server On!');
});

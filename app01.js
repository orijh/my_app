var express = require("express");
var path = require("path");
var app = express();

//app.use 는 미들웨어(middleware) 사용을 위해 쓰이는 함수
//__dirname 은 node 에서 제공하는 node 파일의 경로를 담고 있는 변수
//app.use(express.static(__dirname+"/public")); -> __dirname+'/public' 을 실수로 __dirname+'public'으로 입력하면 오류
//때문에 path.join => /에 상관없이 주소조합을 알아서 해주는 path.join을 사용하도록!
app.use(express.static(path.join(__dirname,"public")));

app.listen(3000,function(){
  console.log('Server On!');
});


//index.html 파일 이름은 바꾸면 안됩니다.
//웹사이트에 접속했을때 정적 폴더 세팅이 되어 있다면 그 폴더 안에 index파일이 있는지를 가장 먼저 찾도록 되어 있습니다.

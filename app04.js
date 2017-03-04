// mongolab.com 가입 온라인 mongodb 사용

var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose'); // mongodb 사용위해 mongoose 선언

// mongoose : ORM(Object-relational mapping) 데이터 베이스를 Object로 만들고 함수명령어로 데이터 조작
// 모델(model), 스키마(Schema)로 구성

// 연결할 mongodb 주소 설정
mongoose.connect("mongodb://test:test@ds029466.mlab.com:29466/ori07");
// 연결된 db정보 저장 변수
var db = mongoose.connection;

db.once("open", function(){
  // 정상 연결되었을겨우 표시할 메세지
  console.log("DB connected!");
});
db.on("error", function(err){
  // db연결 error시 에러 메세지 노출
  console.log("DB ERROR : ", err);
});

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname,'public')));

var data = {count:0};

app.get('/',function(req,res){
  data.count++;
  res.render('my_first_ejs', data);
});
app.get('/reset',function(req,res){
  data.count=0;
  res.render('my_first_ejs', data);
});
app.get('/set/count',function(req,res){
  if(req.query.count) data.count = req.query.count;
  res.render('my_first_ejs', data);
});
app.get('/set/:num',function(req,res){
  data.count = req.params.num;
  res.render('my_first_ejs', data);
});

app.listen(3000, function(){
  console.log('Server On!');
});

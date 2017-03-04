// mongolab.com 가입 온라인 mongodb 사용

var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect("mongodb://test:test@ds029466.mlab.com:29466/ori07");
var db = mongoose.connection;
/*
mongodb : Nosql 데이터페이스
Database : collection 들의 집합입니다. 보통 프로젝트 이름으로..
Collection : 하나의 데이터베이스 셋트 => SQL 의 Table
Document : 하나의 정보, 혹은 다른 여러개의 정보를 담고있는 하나의 object나 하나의 array 를 담고 있음.
      SQL 의 column 과 하지만, object 나 array 를 담을 수 있다는 점에서 SQL데이터베이스와의 다름.
*/

db.once("open", function(){
  console.log("DB connected!");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

var dataSchema = mongoose.Schema({
  // object 를 인자로 받아 그 object를 스키마로 만듬
  // 오브젝트는 이름:타입, 이름:타입.. 으로 구성
  name:String,
  count:Number
});
var Data = mongoose.model('data',dataSchema);

Data.findOne({name:"myData"}, function(err,data){
  if(err) return console.log("Data ERROR: ", err);
  if(!data){
    Data.create({name:"myData",count:0}, function(err,data){
      if(err) return console.log("data ERROR : ", err);
      console.log("Counter initialized : ", data);
    });
  }
});
/*
myData를 찾고 없으면 아래와 같이 생성
Counter initialized :  { __v: 0,
  name: 'myData',
  count: 0,
  _id: 58b158e2167d6e1de81966cf }

__v : 버젼 / __id : 컬렉션 id(겹치지 않는 고유 id)
*/

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

var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect("mongodb://test:test@ds029466.mlab.com:29466/ori07");
var db = mongoose.connection;

db.once("open", function(){
  console.log("DB connected!");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

var dataSchema = mongoose.Schema({
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

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req,res){
  Data.findOne({name:"myData"},function(err,data){
    // 이름이 myData인 데이터를 찾음
    // 찾은 데이터는 funtion(err, data)에 의해 data 인자로 전달
    if(err) return console.log("Data ERROR: ", err);
    data.count++;
    // 이렇게 전달된 데이터는 자바스크립트 object와 동일하게 조작이 가능
    data.save(function(err){
      // 카운터를 하나 증가시킨 후 model의 기본 함수중 하나인 save() 를 사용하여 그 값을 데이터베이스에 업데이트
      if(err) return console.log("Data ERROR : ", err);
      res.render('my_first_ejs',data);
    });
  });
});

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

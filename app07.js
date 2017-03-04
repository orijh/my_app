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
  Data.findOne({name:"myData"}, function(err, data){
    if(err) return console.log("Data ERROR : ", err);
    data.count++;
    data.save(function(err){
      if(err) return console.log("Data ERROR : ", err);
      res.render('my_first_ejs', data);
    });
  });
});

app.get('/reset',function(req,res){
  setCounter(res, 0);
});
app.get('/set/count',function(req,res){
  if(req.query.count) setCounter(res, req.query.count);
  else getCounter(res);
});
app.get('/set/:num',function(req,res){
  if(req.params.num) setCounter(res, req.params.num);
  else getCounter(res);
});

/*
findOne(오브젝트,callback 함수) : 인자로 넘겨 받은 오브젝트에 해당하는 데이터를 하나 찾습니다.
해당하는 데이터가 하나 이상으로 예상되는 경우에는 사용하지 않는 것이 바람직합니다. callback함수로 넘겨지는 data 역시 하나의 object입니다.

find(오브젝트, callback 함수) : 오브젝트에 해당하는 데이터를 모두 찾습니다.
callback 함수로 넘겨지는 data는 array입니다.(설사 결과가 하나라고 하더라도 array입니다.)

create(오브젝트, callback 함수): 오브젝트의 데이터 중에 schema와 일치하는 데이터들만 모아 새로운 데이터를 만듭니다.

findOneAndUpdate(오브젝트1, 오브젝트2, callback 함수) : 오브젝트1에 해당하는 데이터를 찾아 오브젝트2로 교체합니다.
즉 오브젝트2는 오브젝트의 1의 필요한 모든 데이터를 가지고 있어야 합니다. 예를 들어 스키마에 10가지 항목이 있고, 한가지 항목만 업데이트하려고 한다면 이 함수는 올바른 선택이 아닐 수도 있습니다. 이런 경우에는 위 예제의 56~63줄 처럼 findOne으로 찾고, 해당 항목을 변경한 후 .save()하시면 됩니다.

findOneAndRemove(오브젝트, callback함수) : 오브젝트에 해당하는 데이터를 하나 찾아 지워버리는 함수입니다
*/

function setCounter(res, num){
  console.log("setCounter");
  Data.findOne({name:"myData"}, function(err, data){
    if(err) return console.log("Data ERROR: ", err);
    data.count = num;
    data.save(function(err){
      if(err) return console.log("Data ERROR : ", err);
      res.render('my_first_ejs', data);
    });
  });
}

function getCounter(res){
  console.log("getCounter");
  Data.findOne({name:"myData"}, function(err, data){
    if(err) return console.log("Data ERROR : ", err);
    res.render('my_first_ejs', data);
  });
}


app.listen(3000, function(){
  console.log('Server On!');
});

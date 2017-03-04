var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// 환경변수 MONGO_DB에 몽고db 유저정보 pwd 등 저장설정
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open", function(){
  console.log("DB connected!");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

// model setting
var postSchema = mongoose.Schema({
  title: {type : String, required : true},
  body: {type : String, required : true},
  createdAt: {type : Date, default : Date.now},
  updatedAt: Date
});
// title과 body에는 required:true => 데이터 생성, 변경시에 반드시 필요.. 이게 없으면 데이터 생성이 안되고 에러를 리턴
// createdAt의 default:Date.now는 만약 값이 주어지지 않는다면 현재시간(Date.now)를 기본값으로!
var Post = mongoose.model('post', postSchema);

// view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
/*
body parser는 미들웨어(middleware)로 사용되는데, JSON으로 데이터를 분석할 것을 명령했습니다.
(모든 서버에 도착하는 신호들의 body를 JSON으로 분석할 것)

미들웨어(middleware)란?
- 서버에 도착한 신호는 router를 통해서 어떤 response를 할지 결정이 되는데,
router를 통하기 전에(서버도착 - router 중간에) 모든 신호들에게 수행되는 명령어를 미들웨어(middleware)라고 합니다.
app.use()를 통해 수행될 수 있으며, 당연히 router보다 위에 위치해야 합니다.
*/

// set routes
app.get('/posts', function(req,res){
  Post.find({}, function (err,posts) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:posts});
  });
}); // index

app.post('/posts', function(req, res){
  Post.create(req.body.post, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
}); // create

app.get('/posts/:id', function(req, res){
  Post.findById(req.params.id, function(err,post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
}); // show

app.put('/posts/:id', function(req,res){
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" updated"});
  });
}); // update

app.delete('/posts/:id', function(req, res){
  Post.findByIdAndRemove(req.params.id, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" deleted"});
  });
});

// start server
app.listen(3000, function(){
  console.log('Server On!');
});

var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var async = require('async');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

/*
ssport :  nodeJS에서 계정관리를 할 때 가장 많이 쓰이는 package. 각각의 인증방식을 strategy라고 부르는데,
 페이스북을 이용해서 로그인하는 것을 facebook strategy, 트위터를 써서 로그인하는 방식을 twitter strategy 하고함.
 웹사이트에 들어가면 회원가입을 하지 않고 페이스북버튼을 누르면 페이스북 로그인창이 뜨고 정보를 입력하면 가입되는 방식같은 것들..
 현재 사용할것은 직접 가입하는 방식으로 -> local strategy 그래서 passport-local 페키지도 설치
express-session : 로그인이 되고 나면 로그아웃을 하기 전까지 웹사이트는 해당 유저가 로그인이 정보 및 유저별 관리를 하기위해 session package 설치
connect-flash : session에 자료를 flash로 저장하게 해주는 package.
 flash로 저장된 정보는 한번 읽어오면 지워지고, 주로 서버에서 유저에게 메세지를 날리는 용도로 쓰임
async : nodeJS는 기본적으로 callback을 사용해서 비동기(async)로 동작하는데,
 시간이 걸리는 부분에서 마냥 기다리지 않고 다음 코드를 먼저 진행하여 대기시간을 줄이는 것.
 (시간이 걸린다고 무조건 넘어가는 것이 아니라 비동기를 사용하고 있는 함수에 한해서만!) 비동기 함수들을 동기(sync)로 사용하기 위해 사용
*/

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

var userSchema = mongoose.Schema({
  email: {type:String, required:true, unique:true},
  nickname: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  createdAt: {type:Date, default:Date.now}
});

var User = mongoose.model('user',userSchema);

// view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(session({secret:'MySecret'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findBuId(id, function(err, user){
    done(err, user);
  });
});
/*
body parser는 미들웨어(middleware)로 사용되는데, JSON으로 데이터를 분석할 것을 명령했습니다.
(모든 서버에 도착하는 신호들의 body를 JSON으로 분석할 것)

미들웨어(middleware)란?
- 서버에 도착한 신호는 router를 통해서 어떤 response를 할지 결정이 되는데,
router를 통하기 전에(서버도착 - router 중간에) 모든 신호들에게 수행되는 명령어를 미들웨어(middleware)라고 합니다.
app.use()를 통해 수행될 수 있으며, 당연히 router보다 위에 위치해야 합니다.
*/

var LocalStrategy = require('passport-local').Strategy;
passport.use('local-login',
  new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done){
    User.findOne({ 'email' : email}, function(err, user){
      if(err) return done(err);

      if(!user){
        req.flash("email", req.body.email);
        return done(null, false, req.flash('loginError', 'No user found.'));
      }
      if(user.password != password){
        req.flash("email", req.body.email);
        return done(null, false, req.flash('loginError', 'Password does not found.'));
      }
      return done(null, user);
    });
  }
  )
);

//set home routes
app.get('/', function(req, res){
  res.redirect('/posts');
});

app.get('/login', function(req, res){
  res.render('/login/login',{email:req.flash("email")[0], loginError:req.flash('loginError')});
});

app.post('/login',
  function(req, res, next){
    req.flash("email");
    if(req.body.email.length === 0 || req.body.password.length === 0){
      req.flash("email", req.body.email);
      req.flash("loginError", "Please entr both email and password.");
      req.redirect('/login');
    } else {
      next();
    }
  }, passport.authenticate('local-login', {
    successRedirect : '/posts',
    failureRedirect : '/login',
    failureFlash : true
  })
);

// set routes
app.get('/posts', function(req,res){
  Post.find({}).sort('-createdAt').exec(function (err,posts) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/index", {data:posts});
  });
}); // index

app.get('/posts/new', function(req,res){
    res.render("posts/new");
}); // new

app.post('/posts', function(req, res){
  console.log(req.body);
  Post.create(req.body.post, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
  });
}); // create

app.get('/posts/:id', function(req, res){
  Post.findById(req.params.id, function(err,post){
    if(err) return res.json({success:false, message:err});
    res.render("posts/show", {data:post});
  });
}); // show

app.get('/posts/:id/edit', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.render("posts/edit", {data:post});
  });
}); // edit

app.put('/posts/:id', function(req,res){
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts/'+req.params.id);
  });
}); // update

app.delete('/posts/:id', function(req, res){
  Post.findByIdAndRemove(req.params.id, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
  });
}); // destroy

// start server
app.listen(3000, function(){
  console.log('Server On!');
});

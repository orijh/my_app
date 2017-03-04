var express = require("express");
var path = require("path");
var app = express();

app.set("view engine", 'ejs'); // express에게 ejs를 view engine로 사용 선언
app.use(express.static(path.join(__dirname,"public")));

/*
'/' route을 생성하고 '/'에 route에 get신호가 오면 my_first_ejs파일을 render
5번째 줄에 의해 자동으로 /views 폴더를 검색하고, 확장자가 ejs인 파일을 찾도록 함

이제 route을 추가할 차례입니다.
route란 웹페이지 주소에 '/' 를 이용해 웹사이트의 view를 정리하는 것으로, 예를 들면,
http://웹사이트/ -> welcome view를 표시할 것,
http://웹사이트/about -> about view를 표시할 것
등등입니다.

정적인 웹페이지에서는 단순히 홈페이지 폴더 구조가 위 역할을 하게 되는되요,
route는 단순히 페이지를 표시하는 것이 다가 아니라, if함수나 event listener 로 보시면 됩니다.
*/
var data = {count:0}; // data 변수선언

app.get('/', function(req,res){
  // '/' rout에 get신호가 들어오면(브라우저로 페이지 접속하여 request할경우) data 값을 증가시키고
  // 페이지 my_first_ejs를 여는데 data 오브젝트를 넣어 response(응답)함
  data.count++;
  res.render('my_first_ejs', data);
});
app.get('/reset', function(req,res){
  // 마찬가지로 '/reset'로 request 들어올경우 data 값을 0으로 바꾸고, my_first_ejs로 render하는데 data 오브젝트 넣어 response함
  data.count = 0;
  res.render('my_first_ejs', data);
});
app.get('/set/count', function(req,res){
  // '/set/count'로 request 들어올경우 request 쿼리에 count가 있는지 확인하고 그 값을 data 오브젝트에 count에 대입 ex) /set/count?count=2
  if(req.query.count) data.count = req.query.count;
  res.render('my_first_ejs', data);
});
app.get('/set/:num', function(req,res){
  // ':num' 처럼 rout에 콜론이 들어오면 변수로 인식 이값은 request에 parameter로 저장 해당 값을 data 오브젝트에 count에 대입
  // 만약 위에 /set/count보다 위에있고 '/set/count?count=2'라는 request가 들어온다면 /count를 변수로 인식하고
  // 뒤에 ?count=2는 req.query가 없으므로 무시됨
  data.count = req.params.num;
  res.render('my_first_ejs',data);
});

/*
요청 타입따라 app.get(), app.post(), app.put(), app.patch(), app.delete()
argument는 첫번째 route을 나타내는 문자열, 그리고 두번째부터 실행될 함수들이 나열 (app = express();)
위 함수들은 callback함수를 부를때 마다 request, response, next의 3가지의 argument를 넣습니다.
현재는 callback함수에서 next는 사용하지 않았기 때문에 argument에도 넣지 않았습니다.

첫번째 argument는 request로 서버가 받은 request신호의 정보를 담고 있는 오브젝트입니다. client가 보낸 신호이죠.
두번째 argument는 response로 response 신호를 만들기 위한 정보, 함수들을 담고 있는 오브젝트입니다.
세번째 argument는 next로 callback이 나열되는 경우 다음 callback으로 넘어가기 위한 함수입니다.
함수가 끝났다고해서 자동으로 다음 함수로 넘어가는 것이 아니라 다음 callback을 불러줘야 합니다.
그러므로 마지막 callback의 경우 next가 필요하지 않습니다.

참고로 argument는 이름이 중요한 것이 아니라 순서가 중요한 것이기 때문에 이름은 아무것이나 넣어도 됩니다. 저는 주로 req, res, next를 사용합니다.

app.get('경로', function (req, res, next){ 할일; next()}, function(req, res){ 할일 })
*/

app.listen(3000,function(){
  console.log('Server On!');
});

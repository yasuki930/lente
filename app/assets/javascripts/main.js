// 案内図作成用ファンクション
function annaisakusei(directionResult) {
  var myRoute = directionResult.routes[0].legs[0];
  var target = document.getElementById("annaizu");
  // 案内図に書き込み
  // 出発の文章,距離と時間を大体だけど把握
  target.innerHTML = "出発進行！距離は" + myRoute.distance.text + "で" +"時間は約"+ myRoute.duration.text + "かかります．";
  // 多分ここに出発地点の写真いるのでstart地点のURLの定義，これも方向いるけどあとで
  var url_start = "https://maps.googleapis.com/maps/api/streetview?size=1600x400&location=" + myRoute.start_location.lat() + "," + myRoute.start_location.lng();
  // 書き出し
  target.innerHTML += "<img src=" + url_start + "><br>";
  console.log(myRoute);
  // for文でステップ毎にみてるもし書くならここで緯度経度計算して方向ださせる
  for (var i = 0; i < myRoute.steps.length; i++) {
    var url = "https://maps.googleapis.com/maps/api/streetview?size=1600x400&location=" + myRoute.steps[i].end_location.lat() + "," + myRoute.steps[i].end_location.lng();
    // var url = "https://maps.googleapis.com/maps/api/streetview?size=1600x400&location=" + myRoute.steps[i].end_location.lat() + "," + myRoute.steps[i].end_location.lng() + heading=koko;
    target.innerHTML += "ステップ"+[i+1]+myRoute.steps[i].instructions+"<br><img src=" + url + "><br>";
  }
  // 到着の文章
  target.innerHTML += "到着です！お疲れ様でした．";
//   // 多分ここに到着地点の写真いるので到着地点のURLの定義って思ってたけど，最後の写真と同じっぽいのでやめです
//   var url_end = "https://maps.googleapis.com/maps/api/streetview?size=1600x400&location=" + myRoute.end_location.lat() + "," + myRoute.end_location.lng();
//   // 書き出し
//   target.innerHTML += "<img src=" + url_end + ">";
}
// Onload時処理
var map;      //マップのインスタンス
var directionsDisplay = new google.maps.DirectionsRenderer(); //ルートを表示するAPIのインスタンス
var directionsService = new google.maps.DirectionsService(); //ルート検索のAPIのインスタンス
var myLatLng = {lat: 35.602807, lng: 139.684494}; //初期位置はAGL事務室
function initialize() {
  // Google Mapで利用する初期設定用の変数
  var mapOptions = {
    zoom: 16,
    // AGL事務室が初期のセンター
    center:myLatLng
  };
  //GoogleMapの生成
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));
}
//ルート検索を押したときの処理
function calcRoute() {
  // 案内図のところをリセット
  var target = document.getElementById("annaizu");
  target.innerHTML = "案内図作成中…";
  // 出発地に入力したのを引っ張ってきてる
  var start = document.getElementById('start').value;
  // 目的地に入力したのを引っ張ってきてる
  var end = document.getElementById('end').value;
  // ルート検索の設定
  var request = {
    // 出発地に入力したのを引っ張ってきてる
    origin: start,
    // 目的地に入力したのを引っ張ってきてる
    destination: end,
    // 交通手段は歩きだよ
    travelMode: 'WALKING'
  };
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(response); //ルート色塗り
      directionsDisplay.setPanel(document.getElementById('directionsPanel')); //案内文作成
      annaisakusei(response); //案内図作成
    }
  });
}
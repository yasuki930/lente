// 案内図作成用ファンクション
function showSteps(directionResult) {
  var myRoute = directionResult.routes[0].legs[0];
  var target = document.getElementById("annaizu");
//annaizuに書き込みたいインストラクションズを
  for (var i = 0; i < myRoute.steps.length; i++) {
    var url = "https://maps.googleapis.com/maps/api/streetview?size=1600x400&location=" + myRoute.steps[i].end_location.lat() + "," + myRoute.steps[i].end_location.lng(i);
    console.log(url);
    target.innerHTML += "step"+[i+1]+myRoute.steps[i].instructions+"<br><img src=" + url + "><br>"
    console.log(myRoute.steps[i].instructions)
    // console.log(myRoute.steps[i].end_location.lat());
    // console.log(myRoute.steps[i].end_location.lng());
  }
}
// Onload時処理
var map;      //マップのインスタンス
var directionsDisplay = new google.maps.DirectionsRenderer(); //ルートを表示するAPIのインスタンス
var directionsService = new google.maps.DirectionsService();　//ルート検索のAPIのインスタンス
var myLatLng = {lat: 35.602807, lng: 139.684494} //初期位置はAGL事務室
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
            showSteps(response); //案内図作成
        }
    });
}

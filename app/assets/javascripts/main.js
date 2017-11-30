var route_result; //ルート検索結果のインスタンス
var directions; //ルートのインスタンス
var map;      //マップのインスタンス
var myLatLng = {lat: 35.607531, lng: 139.685637}
// Onload時処理
function initialize() {
    // ルートの生成
    directions = new google.maps.DirectionsService();
    // Google Mapで利用する初期設定用の変数
    var mapOptions = {
        zoom: 16,
        center: myLatLng
    };
    // GoogleMapの生成
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    map.setMapTypeId(google.maps.MapTypeId.HYBRID)
}
// [検索]ボタン処理
function searchRoute() {
    // テキストボックスから検索の出発・到着を取得
    var origin = document.getElementById("origin").value;
    var destination = document.getElementById("destination").value;
    // ルート検索を依頼する
    directions.route(
                     { // ルート リクエスト
                     'origin'     : origin,     //出発地点
                     'destination': destination,//到着地点
                     'travelMode' : google.maps.DirectionsTravelMode.WALKING, //ルートタイプ:徒歩
                     'unitSystem' : google.maps.DirectionsUnitSystem.METRIC,
                     'optimizeWaypoints' : true, //ルート最適化
                     'provideRouteAlternatives' : true //複数ルート検索
                     },
                     function(results) { // ルート結果callback関数
                     var poly = new google.maps.Polyline({
                                                         map: map,              //マップ
                                                         path: results.routes[0].overview_path,//ポリラインの座標の列
                                                         strokeWeight: 5,       //ストローク幅(ピクセル単位)
                                                         strokeColor: "#f01010",//16進数形式のストロークの色
                                                         strokeOpacity: 0.5     //ストロークの不透明度(0.0～1.0)
                                                         });
                     route_result = results.routes[0].overview_path;
                     map.setCenter(results.routes[0].bounds.getCenter()); // 検索結果の中心設定
                     }
                     );
};

function plotLatLng(Lat, Lng) {
    var latlng = new google.maps.LatLng(Lat,Lng);
    var mopts = {
        position: latlng,
        map: map
    };
    var marker = new google.maps.Marker(mopts);
};

function calc_dividing_point(Lat1, Lat2, Lng1, Lng2, Num) {
    var div_num = Num;
    var divided_LatLng = new Array(2);
    divided_LatLng[0] = new Array(div_num);
    divided_LatLng[1] = new Array(div_num);
    for (var i=0 ; i < div_num ; i++){
        divided_LatLng[0][i] = ((div_num-i)*Lat1 + i*Lat2)/div_num;
        divided_LatLng[1][i] = ((div_num-i)*Lng1 + i*Lng2)/div_num;
    }
    return divided_LatLng;
}

function make_anchor_point(Num){
    var anchor_point = new Array(route_result.length);
    for (var i=0 ; i < (route_result.length-1) ; i++){
        anchor_point[i] = calc_dividing_point(route_result[i].lat(), route_result[i+1].lat(), route_result[i].lng(), route_result[i+1].lng(), Num)
    }
    anchor_point[route_result.length-1] = [route_result[(route_result.length-1)].lat(), route_result[(route_result.length-1)].lng()];
    return anchor_point;
}

function plotLoop(maxCount, i) {
    if (i <= maxCount) {
        plotLatLng(route_result[i].lat(), route_result[i].lng());
        setTimeout(function(){plotLoop(maxCount, ++i)}, 100);
    }
}

function plotLoop1(Num) {
    var dev_anchor_point = make_anchor_point(Num);
    for (var i=0 ; i < dev_anchor_point.length ; i++ ){
        for(var j=0 ; j < dev_anchor_point[0][0].length ; j++){
            plotLatLng(dev_anchor_point[i][0][j], dev_anchor_point[i][1][j]);
        }
    }
}

function dumpLoop(maxCount, i) {
    if (i <= maxCount) {
        dumpStrView(route_result[i].lat(), route_result[i].lng());
        setTimeout(function(){dumpLoop(maxCount, ++i)}, 100);
    }
}

function calc_heading(Lng1, Lng2, Lat1, Lat2) {
    var north = Array(0,1);
    var vec = new Array(2);
    vec[0] = Lat2 - Lat1;
    vec[1] = Lng2 - Lng1;
    var cosine = (north[0]*vec[0] + north[1]*vec[1])/Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2));
    var theta = Math.acos(cosine) / Math.PI * 180;
    if(vec[0] < 0){
        theta = (180 - theta)+180;
    }
    return theta;
}

function calc_distance(Lat1, Lat2, Lng1, Lng2) {
    Lat1 = Lat1/180*Math.PI;
    Lat2 = Lat2/180*Math.PI;
    Lng1 = Lng1/180*Math.PI;
    Lng2 = Lng2/180*Math.PI;
    Re = 6378137;
    d = Re * Math.acos( Math.sin(Lng1)*Math.sin(Lng2) + Math.cos(Lng1)*Math.cos(Lng2)*Math.cos(Lat2-Lat1) );
    return(d);
}

function dumpStrView(Num) {
    var head_data = [];
    var size = 7;
    nwin = window.open("", "Newwindow","width=280,height=480");
    nwin.document.open();
    nwin.document.write("<HTML><HEAD>");
    nwin.document.write("<TITLE>New one</TITLE>");
    nwin.document.writeln("<BODY>");
    nwin.document.writeln("<FONT size=" + size + ">");
    nwin.document.writeln("START");
    nwin.document.writeln("<br>");
    var dev_anchor_point = make_anchor_point(Num);
    var index = 0;
    for (var i=0 ; i+1 < dev_anchor_point.length ; i++ ){
        for(var j=0 ; j < Num ; j++){
            var width = 1600;
            var height = 400;
            var lat1 = dev_anchor_point[i][0][j];
            var lng1 = dev_anchor_point[i][1][j];
            if(j+1 < Num) {
                var lat2 = dev_anchor_point[i][0][j+1];
                var lng2 = dev_anchor_point[i][1][j+1];
            }
            if(j+1 == Num){
                if(i+1 < dev_anchor_point.length){
                    var lat2 = dev_anchor_point[i+1][0][0];
                    var lng2 = dev_anchor_point[i+1][1][0];
                }
                if(i+1 == dev_anchor_point.length & Num == 1){
                    var lat1 = dev_anchor_point[i-1][0][0];
                    var lng1 = dev_anchor_point[i-1][1][0];
                    var lat2 = dev_anchor_point[i][0][0];
                    var lng2 = dev_anchor_point[i][1][0];
                }
                if(i+1 == dev_anchor_point.length & Num > 1){
                    var lat1 = dev_anchor_point[i][0][j-1];
                    var lng1 = dev_anchor_point[i][1][j-1];
                    var lat2 = dev_anchor_point[i][0][j];
                    var lng2 = dev_anchor_point[i][1][j];
                }
                    
            }
            var head = calc_heading(lat1, lat2, lng1, lng2);
            head_data.push(head);
            var diff_head = head_data[index]-head_data[index-1];
            if(index > 0 & Math.abs(diff_head) > 20 & Math.abs(diff_head) < 340) {
                if(diff_head > 0){
                    nwin.document.write(Math.round(diff_head/360*12) +"時の方角に曲がります");
                    nwin.document.write("<br>");
                }
                if(diff_head < 0){
                    nwin.document.write(12+Math.round(diff_head/360*12) +"時の方角に曲がります");
                    nwin.document.write("<br>");
                }
            }
            if(i+1 < dev_anchor_point.length & Math.abs(diff_head) <= 20 | Math.abs(diff_head) >= 340) {
                var distance = calc_distance(lat1, dev_anchor_point[i+1][0][0], lng1, dev_anchor_point[i+1][1][0]);
                nwin.document.write("直進します");
                nwin.document.write("<br>");
            }
            var pitch = 0;
            var fov = 60;
            var zoom = 0;
            var url = "https://maps.googleapis.com/maps/api/streetview?size=" + width + "x" + height + "&location=" + lat1 + "," + lng1 + "&heading=" + head + "&pitch=" + pitch + "&fov=" + fov + "&zoom=" + zoom;
                        nwin.document.write("<img src=" + url + "/>")
                        nwin.document.write("<br>")
                        //nwin.document.write(calc_distance(lat1, lat2, lng1, lng2) + "m進む")
                        //nwin.document.write(head + ", ")
                        //nwin.document.write(lat1 + ", ")
                        //nwin.document.write(lng1 + ", ")
                        nwin.document.write("<br>")
                        index = index + 1;
                    }
                }
    nwin.document.writeln("目的地です");
    nwin.document.writeln("<br>");
    nwin.document.write("</FONT>");
    nwin.document.write("</BODY></HTML>");
    nwin.document.close();
}
//コンビニ位置の追加
function convenience_store_search (){
  //コンビニ位置情報を追加したマップ
  var infowindow;

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

　//stepの座標をリスト　
  var pathList = [];
  for (var i = 0; i < route.steps.length; i++) {
    //lat:緯度　lng:経度
    var stepPoint = {lat: route.steps[i].path[0].lat(), lng: route.steps[i].path[0].lng()};
    pathList.push(stepPoint);
    
  }
//曲がり角に相当する2点間を直線で結ぶ
for (var i = 0; i < pathList.length - 1 ; i++) {
　var polyline = new google.maps.Polyline( {
　    map:map,
　    path: [
　    new google.maps.LatLng(pathList[i].lat,pathList[i].lng) ,
　    new google.maps.LatLng(pathList[i+1].lat,pathList[i+1].lng) ,
　    ],
　  } ) ;
　}
　  
　  
  for(i = 0; i < pathList.length; i++) {
    service.nearbySearch({
      location: pathList[i],
      //半径10mの範囲でコンビニを検索
      radius: 100,
      //コンビニを探してるよ
      type: ['convenience_store']
 
    }, callback);
  }

}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var host = location.hostname ;
  var protocol = location.protocol ;
  var imageurl = protocol + "//" + host + "/conbini15.png" ;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: imageurl
  });
  google.maps.event.addListener(marker, 'click', function(){
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  })
}
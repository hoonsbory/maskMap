
	
	$(function() {
		var excepted = false;
		var result;
		var result2;
		var positionDeny = false;
		var myPositionBtn = false;
		var dragEventSWitch = true;
		var bottomListSwitch = false;
		var myPositionMarker =[];
		var menuSwitch = "stock";
		var beforeOverlay = [];
		var overlayList = [];
		var beforeMarker = [];
		var centerLat;
		var centerLng;
		var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(37.498614, 127.041503), //지도의 중심좌표.
	level: 4 //지도의 레벨(확대, 축소 정도)
	
};

var day = new Date;
var today = day.getDay();
if(today==0){
	$("#date").text("일요일")
	$("#firstSpan").text("주말은 ")
	var allPeople = '<span id="weekendBuy">모든 국민 </span><span>구매 가능</span>'
		
	$("#firstSpan").after(allPeople)

}
if(today==1){
	$("#date").text("월요일")
	$("#frontBirth").text("1")	
	$("#behindBirth").text("6")	
}
if(today==2){
	$("#date").text("화요일")
	$("#frontBirth").text("2")	
	$("#behindBirth").text("7")	
}
if(today==3){
	$("#date").text("수요일")
	$("#frontBirth").text("3")	
	$("#behindBirth").text("8")	
	
}
if(today==4){
	$("#date").text("목요일")
	$("#frontBirth").text("4")	
	$("#behindBirth").text("9")	
}
if(today==5){
	$("#date").text("금요일")
	$("#frontBirth").text("0")	
	$("#behindBirth").text("5")	
}
if(today==6){
	$("#date").text("토요일")
	$("#firstSpan").text("주말은 ")
	var allPeople = '<span id="weekendBuy">모든 국민 </span><span>구매 가능</span>'
		
		$("#firstSpan").after(allPeople)
	
}

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
map.setMaxLevel(5);

function panTo(lat,lng) {
    // 이동할 위도 경도 위치를 생성합니다 
    var moveLatLon = new kakao.maps.LatLng(lat,lng);
    
    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);            
}      

function closeOverlay() {
    beforeOverlay[0].setMap(null);     
}

document.getElementById("notice").click();



// 주소로 좌표를 검색합니다
function addressSearch(address){
var ps = new kakao.maps.services.Places(); 
if (!address.replace(/^\s+|\s+$/g, '')) {
	alert('키워드를 입력해주세요!');
	return false;
	}
// 키워드로 장소를 검색합니다
ps.keywordSearch(address, placesSearchCB); 

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        var bounds = new kakao.maps.LatLngBounds();

        for (var i=0; i<data.length; i++) {
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }       

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
		map.setBounds(bounds);
		sendAddress();
    } 
}
 
}

$("#address").keyup(function(){
	if (window.event.keyCode == 13) {
	var keyword = document.getElementById('address').value;

	
 	// 엔터키가 눌렸을 때 실행할 내용
 	addressSearch($("#address").val());
}
})


// This function converts decimal degrees to radians
function deg2rad(deg) {
        return (deg * Math.PI / 180.0);
    }
     
    // This function converts radians to decimal degrees
    function rad2deg(rad) {
        return (rad * 180 / Math.PI);
    }


	function distance(lat1, lon1, lat2, lon2) {
         if(JSON.stringify(lat2)=="null"){
			return null;
		 }

		 var theta = lon1 - lon2;
		 var dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
		  
		 dist = Math.acos(dist);
		 dist = rad2deg(dist);
		 dist = dist * 60 * 1.1515;
		  
		
		
		 dist = dist * 1609.344;
		 
		 return (dist);
	 }
	 
 
function sendAddress(){
	$(".storeLi").remove();
	$("#centerChange").css("display","none");
	$(".loading").css("display","block")
	var latlng = [map.getCenter().getLat(), map.getCenter().getLng()]
	var latlngJson = JSON.stringify(latlng)
 $.ajax({
	url: '/address',
	type: 'post',
	data: latlngJson, //문자열 배열을 보내기전에 json문자열로 변환해야 에러가 안난다. 그냥 문자열은 안해도 됐는데 배열을 해야한다. 이유는 모름.
	
    contentType: 'application/json;charset=UTF-8',
    success: function (data) {
		result = JSON.parse(data);
		
		if(result.count==0){
			$(".loading").css("display","none")
			var noStores = '<div class="storeLi" style="position : absolute; left : 50%; top : 50%;">근처에 약국없다 가라...</div>'
		$(".storeList").append(noStores)
		return

		}else{
			
	beforeMarker.forEach(i=>{

		i.setMap(null);
	})
	
beforeMarker = [];
overlayList = [];
		result.stores.forEach(i=>{
			if(!i.stock_at || JSON.stringify(i.stock_at)=="null"){
				i.type = 999;
				var distanceResult = Math.round(distance(centerLat,centerLng,i.lat,i.lng))
				i.code = distanceResult;
			}else{
				var test2 = i.stock_at.substr(0,4)
					test2 += i.stock_at.substr(5,2)
					test2 += i.stock_at.substr(8,2)
					test2 += i.stock_at.substr(11,2)
					test2 += i.stock_at.substr(14,2)
					i.type = test2
				var distanceResult = Math.round(distance(centerLat,centerLng,i.lat,i.lng))
				i.code = distanceResult;
	}

	

		})


		var emptyCount = false;
		var count = 1;
		result.stores.forEach(i => {
			if(excepted==true && i.remain_stat!="plenty" && i.remain_stat!="some" && i.remain_stat!="few"){
				return true;
			}
			if(!i.lat) return true;
			emptyCount = true;
	

// if(!i.stock_at || JSON.stringify(i.stock_at)=="null"){
// i.type = "입고 대기"
// }else{
// var test2 = i.stock_at.substr(0,4)
// 		test2 += i.stock_at.substr(5,2)
// 		test2 += i.stock_at.substr(8,2)
// 		test2 += i.stock_at.substr(11,2)
// 		test2 += i.stock_at.substr(14,2)
// 		i.type = test2
if(i.type==999)i.type = "입고 대기"
if(i.type!="입고 대기"){
var nowDate = new Date(i.type.substr(0,4), (i.type.substr(4,2)-1), i.type.substr(6,2), i.type.substr(8,2), i.type.substr(10,2))
		var today = new Date();
		var betweenDay = (today.getTime() - nowDate.getTime())/1000/60/60/24;
		if(betweenDay>=1){
			i.type = Math.round(betweenDay)+"일 전"
		}else{
			betweenDay = betweenDay*24;
			if(betweenDay>=1 && betweenDay <24){
				i.type = Math.round(betweenDay)+"시간 전"
			}else{
				betweenDay = betweenDay*60;
				i.type = Math.round(betweenDay)+"분 전"
			}
		}
}
i.created_at = JSON.stringify(i.created_at)=="null" ? "입고 대기" : i.created_at;

	

	// var distanceResult = Math.round(distance(centerLat,centerLng,i.lat,i.lng))
	// i.code = distanceResult;


	if(positionDeny==false){
		if(i.code!=0){
	if(i.code>=1000){
		i.code = i.code/1000
		i.code = i.code.toFixed(1)+"km"
	}else{
		i.code = i.code+"m"
	}
	}
	}else{
		i.code = 0
	}

var markerColor;
var jsonRemain = JSON.stringify(i.remain_stat)
var statColor;
switch (jsonRemain) {
	case '"plenty"': i.remain_stat = "충분" ,markerColor = "green.png", statColor = "#009473"
		
		break;
	case '"some"': i.remain_stat = "보통" , markerColor = "yellow.png", statColor = "#F0C05A"
		
		break;
	case '"few"': i.remain_stat = "부족" , markerColor = "red.png", statColor = "#DD4124"
		
		break;
	case '"empty"': i.remain_stat = "없음" , markerColor = "gray.png" , statColor = "#84898C"
		
		break;
	case '"break"': i.remain_stat = "없음" , markerColor = "gray.png", statColor = "#84898C"
		
		break;
	case "null": i.remain_stat = "없음"  , markerColor = "gray.png" , statColor = "#84898C"
		
		break;
		
	default:
		break;
}
if(!i.remain_stat) i.remain_stat = "없음"
var imageSrc = '/static/img/'+markerColor, // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(28, 36), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(15, 42)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
    markerPosition = new kakao.maps.LatLng(i.lat, i.lng); // 마커가 표시될 위치입니다	

var marker = new kakao.maps.Marker({
	map: map,
	position: markerPosition,
	image: markerImage
	
});




var content = '<div id="wrap" class="wrap">' + 
            '    <div class="info">' + 
            '        <div id="'+i.name+'" class="title">' + 
            i.name + 
            '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="desc">' + 
            '                <div id="overlayAddress" class="ellipsis">'+i.addr+'</div>' + 
			'                <div id="overlayDistance" class="jibun ellipsis">'+i.code+'</div>' + 
            '                <div id="overlayStock" class="jibun ellipsis">'+i.type+" 입고"+'</div>' + 
			'                <div id="overlayStat" style="background : '+statColor+'" class="jibun ellipsis">'+i.remain_stat+'</div>' + 
            '                <div><a href="https://map.kakao.com/link/to/'+i.name+","+i.lat+","+i.lng+'" target="_blank" class="link">길찾기</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';
			

// 마커 위에 커스텀오버레이를 표시합니다
// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
 var overlay = new kakao.maps.CustomOverlay({
    content: content,
    position: marker.getPosition()       
});
var close = document.createElement('div')
			close.className = "close"
			close.onclick = closeOverlay


kakao.maps.event.addListener(marker, 'click', function() {
	panTo(i.lat,i.lng);
	if(beforeOverlay[0]){
	beforeOverlay[0].setMap(null);
	}
	beforeOverlay = [];
    overlay.setMap(map);
	beforeOverlay.push(overlay);
	document.getElementById(i.name).appendChild(close)
	document.getElementById("wrap").parentNode.style.zIndex = "900"

});

// 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
beforeMarker.push(marker);
overlayList.push(overlay);
count++;
});

result2 = JSON.parse(JSON.stringify(result))

if(menuSwitch=="stock"){
    document.getElementById("recentStock").click();
}else{
	
	document.getElementById("nearby").click();
}
$(".loading").css("display","none")

}



    },
	

    error:function(){
        alert("통신실패");
    }

})
}


 function nearby() {
	if(positionDeny==true){
		alert("위치 제공을 차단하셨거나 지원하지 않습니다.")
		return
	}
	 $(".storeLi").remove();
	 if(!result2.stores[0]){
		 var noStores = '<div class="storeLi" style="position : absolute; left : 50%; top : 50%;">근처에 약국없다 가라...</div>'
		 $(".storeList").append(noStores)
		 return
		}
		
			
			result2.stores.forEach(i=>{
				var distanceResult = Math.round(distance(centerLat,centerLng,i.lat,i.lng))
				i.code = distanceResult;
				
})

result2.stores.sort(function(a,b){
	return a.code - b.code
})

$(".scrollDiv").remove();
var scrollDiv = '<div class="scrollDiv"><ul class="storeList"></ul></div>'
$("#firstBar").after(scrollDiv)
$("#nearby").css("border-bottom","4px solid #C0D725")
$("#nearby").css("color","#C0D725")
$("#recentStock").css("color","#F1EEE6")
$("#recentStock").css("border-bottom","none")
	var count = 1;
	var emptyCount = false;
	var mostClose = 0;	
	var divCount = 0;
	
	function scrollContent(){
	$(".loading").css("display","block")

		var counter = 0;
		var breakCount = 0;
		
		
		result2.stores.some(i=>{
			if(divCount>counter){
				counter++;
				return false;
			}
			
			if(excepted==true && i.remain_stat!="충분" && i.remain_stat!="부족" && i.remain_stat!="보통"){
				mostClose++;
				counter++;
				divCount++
				return false;
			}
			if(!i.lat) {
				mostClose++;
				counter++;
				divCount++;
				return false;
			}
			emptyCount = true;
	if(positionDeny==false){
		if(i.code!=0){
	if(i.code>=1000){
		i.code = i.code/1000
		i.code = i.code.toFixed(1)+"km"
	}else{
		i.code = i.code+"m"
	}
	}
	}else{
		i.code = 0
	}
	var statColor;

	switch (i.remain_stat) {
		case "충분": statColor = "#009473"
			
			break;
		case "보통": statColor = "#F0C05A"
			
			break;
		case "부족": statColor = "#DD4124"
			
			break;
		case "없음": statColor = "#84898C"
			
			break;
	
		default:
			break;
	}

	var contentList = '<li class="storeLi"><div class="storename'+count+'">'+
	 '<div class="storeName">'+i.name+'</div>' +
	 '<div class="distanceMe">'+i.code+'</div>' +
	 '<div class="remainStat"><div style="background : '+statColor+';" class="realStat">'+i.remain_stat+'</div></div>' +
	 '<div class="stockTime">'+i.type+" 입고"+'</div></div></li>'

		$(".storeList").append(contentList)
	var count2 = 0;
	
	var content = '<div id="wrap" class="wrap">' + 
            '    <div class="info">' + 
            '        <div id="'+i.addr+'" class="title">' + 
            i.name + 
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="desc">' + 
            '                <div id="overlayAddress" class="ellipsis">'+i.addr+'</div>' + 
			'                <div id="overlayDistance" class="jibun ellipsis">'+i.code+'</div>' + 
            '                <div id="overlayStock" class="jibun ellipsis">'+i.type+" 입고"+'</div>' + 
			'                <div id="overlayStat" style="background : '+statColor+'" class="jibun ellipsis">'+i.remain_stat+'</div>' + 
            '                <div><a href="https://map.kakao.com/link/to/'+i.name+","+i.lat+","+i.lng+'" target="_blank" class="link">길찾기</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';
			
// 마커 위에 커스텀오버레이를 표시합니다
// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
var position = new kakao.maps.LatLng(
	// southWest.lat() + (latSpan * Math.random()),
	// southWest.lng() + (lngSpan * Math.random())
	i.lat,i.lng
);
 var overlay = new kakao.maps.CustomOverlay({
    content: content,
    position: position       
});

	var close = document.createElement('div')
			close.className = "close"
			close.onclick = closeOverlay

			$(".storename"+count).click(async function(){
				dragEventSWitch = false;
				if(dragEventSWitch==false) panTo(i.lat,i.lng);
				if(beforeOverlay[0]){
					beforeOverlay[0].setMap(null);
				}
				beforeOverlay = [];
				await overlay.setMap(map);
				beforeOverlay.push(overlay);
				// if(!document.getElementById(i.addr)){
					// 	console.log(document.getElementById(i.addr))
					// 	doubleClick(i.addr)
					// }
					setTimeout(() => {
						document.getElementById(i.addr).appendChild(close)
						document.getElementById("wrap").parentNode.style.zIndex = "900"
						
					}, 400);
		dragEventSWitch = true;
	})
	count++;
	
	
	divCount++;
	counter++;
	breakCount++;
	if(result2.stores.length<7 && breakCount==result2.stores.length) return true;
	if(breakCount==7) {
		
		return true;
	}
	
})
$(".loading").css("display","none")


	}
	scrollContent();
	$(".scrollDiv").on("scroll", function() {
	var scrollHeight = $(".storeList").height();
	var scrollPosition = $(".scrollDiv").height() + $(".scrollDiv").scrollTop();	
	console.log(scrollHeight)	
	console.log(scrollPosition)
	if(scrollPosition > scrollHeight - 50 && divCount!=result2.stores.length){ 
		scrollContent();
		// exe 
	} 
});
if(emptyCount==false){
		var noStores = '<div class="storeLi" style="position : absolute; left : 50%; top : 50%;">근처에 약국없다 가라...</div>'
		$(".storeList").append(noStores)
		return
	}


	menuSwitch = "distance";
	$(".slideUp").scrollTop(0);
}
function recentStock(){
	$(".scrollDiv").remove();
	var scrollDiv = '<div class="scrollDiv"><ul class="storeList"></ul></div>'
	$("#firstBar").after(scrollDiv)
	$("#recentStock").css("border-bottom","4px solid #C0D725")
	 $("#recentStock").css("color","#C0D725")
	 $("#nearby").css("color","#F1EEE6")
	 $("#nearby").css("border-bottom","none")
	var count = 1;
	var emptyCount = false;
	var mostClose = 0;	
	var divCount = 0;
	if(!result.stores[0]){
		var noStores = '<div class="storeLi" style="position : absolute; left : 50%; top : 50%;">근처에 약국없다 가라...</div>'
		$(".storeList").append(noStores)
		return
	}
	result.stores.forEach(i=>{
		
		if(!i.stock_at || JSON.stringify(i.stock_at)=="null"){
			i.type = 999;;
		}else{
			var test2 = i.stock_at.substr(0,4)
			test2 += i.stock_at.substr(5,2)
			test2 += i.stock_at.substr(8,2)
			test2 += i.stock_at.substr(11,2)
			test2 += i.stock_at.substr(14,2)
			i.type = test2



}
	})
	
	result.stores.sort(function(a,b){
		return b.type - a.type;
	})

	
	
	function scrollContent(){
	$(".loading").css("display","block")

		var counter = 0;
		var breakCount = 0;
		
			
		result.stores.some(i=>{
			if(divCount>counter){
				counter++;
				return false;
			}
			
			if(excepted==true && i.remain_stat!="충분" && i.remain_stat!="부족" && i.remain_stat!="보통"){
				mostClose++;
				counter++;
				divCount++
				return false;
			}
			if(!i.lat) {
				mostClose++;
				counter++;
				divCount++;
				return false;
			}
			emptyCount = true;
		if(i.type==999)i.type = "입고 대기"
	if(i.type!="입고 대기"){
		var nowDate = new Date(i.type.substr(0,4), (i.type.substr(4,2)-1), i.type.substr(6,2), i.type.substr(8,2), i.type.substr(10,2))
		var today = new Date();
		var betweenDay = (today.getTime() - nowDate.getTime())/1000/60/60/24;
		if(betweenDay>=1){
			i.type = Math.round(betweenDay)+"일 전"
		}else{
			betweenDay = betweenDay*24;
			if(betweenDay>=1 && betweenDay <24){
				i.type = Math.round(betweenDay)+"시간 전"
			}else{
				betweenDay = betweenDay*60;
				i.type = Math.round(betweenDay)+"분 전"
			}
		}
}
		
	
var statColor;

	switch (i.remain_stat) {
		case "충분": statColor = "#009473"
			
			break;
		case "보통": statColor = "#F0C05A"
			
			break;
		case "부족": statColor = "#DD4124"
			
			break;
		
		case "없음": statColor = "#84898C"
			
			break;
	
		default:
			break;
	}


var contentList = '<li class="storeLi"><div class="storename'+count+'">'+
 '<div class="storeName">'+i.name+'</div>' +
 '<div class="distanceMe">'+i.code+'</div>' +
 '<div class="remainStat"><div style="background : '+statColor+';" class="realStat">'+i.remain_stat+'</div></div>' +
 '<div class="stockTime">'+i.type+" 입고"+'</div></div></li>'
		$(".storeList").append(contentList)
	var count2 = 0;
	
	var content = '<div id="wrap" class="wrap">' + 
            '    <div class="info">' + 
            '        <div id="'+i.addr+'" class="title">' + 
            i.name + 
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="desc">' + 
            '                <div id="overlayAddress" class="ellipsis">'+i.addr+'</div>' + 
			'                <div id="overlayDistance" class="jibun ellipsis">'+i.code+'</div>' + 
            '                <div id="overlayStock" class="jibun ellipsis">'+i.type+" 입고"+'</div>' + 
			'                <div id="overlayStat" style="background : '+statColor+'" class="jibun ellipsis">'+i.remain_stat+'</div>' + 
            '                <div><a href="https://map.kakao.com/link/to/'+i.name+","+i.lat+","+i.lng+'" target="_blank" class="link">길찾기</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';
			
// 마커 위에 커스텀오버레이를 표시합니다
// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
var position = new kakao.maps.LatLng(
	
	i.lat,i.lng
);
 var overlay = new kakao.maps.CustomOverlay({
    content: content,
    position: position       
});

	var close = document.createElement('div')
			close.className = "close"
			close.onclick = closeOverlay

	$(".storename"+count).click(function(){
		dragEventSWitch = false;
		if(dragEventSWitch==false) panTo(i.lat,i.lng);
	if(beforeOverlay[0]){
	beforeOverlay[0].setMap(null);
	}
	beforeOverlay = [];
    overlay.setMap(map);
	beforeOverlay.push(overlay);
	setTimeout(() => {
		document.getElementById(i.addr).appendChild(close)
		document.getElementById("wrap").parentNode.style.zIndex = "900"
						
			}, 400);
	dragEventSWitch = true;

	})

	count++;

	
	divCount++;
	counter++;
	breakCount++;
	if(result.stores.length<7 && breakCount==result.stores.length) return true;
	if(breakCount==7) {
		
		return true;
	}
	
})
$(".loading").css("display","none")


	}
	scrollContent();
	$(".scrollDiv").on("scroll", function() {
	var scrollHeight = $(".storeList").height();
	var scrollPosition = $(".scrollDiv").height() + $(".scrollDiv").scrollTop();		
	if(scrollPosition > scrollHeight - 50&& divCount!=result.stores.length){ 
		scrollContent();
		// exe 
	} 
});



	if(emptyCount==false){
		var noStores = '<div class="storeLi" style="position : absolute; left : 50%; top : 50%;">근처에 약국없다 가라...</div>'
		$(".storeList").append(noStores)
		return
	}

	menuSwitch = "stock";
	$(".slideUp").scrollTop(0);
}

$('#recentStock').click(function(){
	recentStock();
})
$('#nearby').click(function(){
	nearby();
})	
$("#reSearch").click(function(){
	if(menuSwitch=="stock"){
		recentStock();
	}else{
	nearby();
	}
})
$("#myPosition").click(function(){
	if(myPositionBtn==false){
		myPositionBtn = true
		if(myPositionMarker[0]) {
			myPositionMarker[0].setMap(null)
		}
		myPosition();
		$("#myPositionImg").attr("src","/static/img/myPositionClicked.png")
		$("#myPosition").css("background","#0f4c81")
	}else{
		$("#myPositionImg").attr("src","/static/img/myPosition.png")
		$("#myPosition").css("background","white")
		if(myPositionMarker[0]) {
			myPositionMarker[0].setMap(null)
		}
		if(myPositionMarker[1]) {
			myPositionMarker[1].setMap(null)
		}
		myPositionBtn = false;
		myPositionMarker = [];
	}
})
// $("#excepted").click(function(){
// 	console.log(excepted)
// 	if(excepted==true){
// 		excepted = false;
// 		if(beforeOverlay[0]) beforeOverlay[0].setMap(null)
// 		sendAddress();
// 	}else{
// 		excepted = true;
// 		if(beforeOverlay[0]) beforeOverlay[0].setMap(null)
// 		sendAddress();
// 	}
// })
$("#searchIcon").click(function(){
	addressSearch($("#address").val())
})
$("#exceptedOn").click(function(){
	excepted = true
	if(beforeOverlay[0]) beforeOverlay[0].setMap(null)
		sendAddress();
})
$("#exceptedOff").click(function(){
	excepted = false
	if(beforeOverlay[0]) beforeOverlay[0].setMap(null)
		sendAddress();
})
$('#slideContentDown').on('click', function()
	{
		$('.slideDown').slideDown();
	});
	$('#slideContentUp').on('click', function()
	{
		$('.slideDown').slideUp();
	});
	
	$('#reverseSlideContentUp').on('click', function()
	{
		if($('#reverseSlideContentUp').text()=="목록 열기"){
		if(document.getElementsByClassName("storeList")[0].childElementCount==0){
			recentStock();
		}	
		$('.slideUp').slideDown();
		$('#myPosition').animate({bottom:"42%"}, 400);
		$('#reverseSlideContentUp').animate({bottom:"42%"}, 400);
		$('.remainInfo').animate({bottom:"42%"}, 400);
		$('#reverseSlideContentUp').html("목록 닫기")
		}else{
		$('.slideUp').slideUp();
		$('#myPosition').animate({bottom:"18px"}, 400);
		$('#reverseSlideContentUp').animate({bottom:"18px"}, 400);
		$('.remainInfo').animate({bottom:"18px"}, 400);
		$('#reverseSlideContentUp').html("목록 열기")
		}
	});
function myPosition(){
	
	// if (navigator.geolocation) {
		$(".loading").css("display","block")
		navigator.geolocation.getCurrentPosition (function(pos) {
			positionDeny = false;
				centerLat = pos.coords.latitude
				centerLng = pos.coords.longitude
				map.setCenter(new kakao.maps.LatLng(centerLat,centerLng))
				var imageSrc = '/static/img/myPoint.png', // 마커이미지의 주소입니다    
    			imageSize = new kakao.maps.Size(16, 16), // 마커이미지의 크기입니다
   				imageOption = {offset: new kakao.maps.Point(15, 42)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
				var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
    			markerPosition = new kakao.maps.LatLng(centerLat, centerLng); // 마커가 표시될 위치입니다	

				var marker = new kakao.maps.Marker({
					map: map,
					position: markerPosition,
					image: markerImage
	
				});
							myPositionMarker.push(marker);
							console.log(11)
							sendAddress();
						}, function(error){
							positionDeny = true;
							sendAddress();
						})
// }else{
// 	alert("위치정보를 확인할 수 없어 기본 설정된 위치로 이동합니다.")
// 	sendAddress();
// }
}

myPosition();

if (navigator.geolocation) {

}else{
	alert("위치정보를 확인할 수 없어 기본 설정된 위치로 이동합니다.")
	positionDeny = true;
	sendAddress();
}

$("#centerChange").click(function(){
	sendAddress();
})

kakao.maps.event.addListener(map, 'tilesloaded', function() {
	// if(dragEventSWitch==true){
		$("#centerChange").css("display","block");
		

		
	// }
}); 
	});
	
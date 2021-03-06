$(function () {
	var excepted = false;
	var result;
	var result2;
	var positionDeny = false;
	var myPositionBtn = false;
	var myPositionMarker = [];
	var menuSwitch = "stock";
	var beforeOverlay = [];
	var overlayList = [];
	var beforeMarker = [];
	var beforeClusterer = [];
	var centerLat;
	var centerLng;
	var firstLoad = false;
	var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
	var options = { //지도를 생성할 때 필요한 기본 옵션
		center: new kakao.maps.LatLng(37.580435, 127.217011), //지도의 중심좌표.
		level: 4 //지도의 레벨(확대, 축소 정도)ㅁ

	};
	var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
	map.setMaxLevel(9);

	var geoOptions = {
		maximumAge: 10000, //위치정보 유효 시간
		enableHighAccuracy: false, //정확한 위치 정보 끄기
	}

	function myPosition() {  //내 위치 불러오기
		$(".loading").css("display", "block")
		if (navigator.geolocation) {
			// if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(callback, error, geoOptions)
		} else {
			alert("위치정보를 확인할 수 없어 기본 설정된 위치로 이동합니다.")
			firstLoad = true;
			positionDeny = true;
			sendAddress();
		}
	}

	function callback(pos) {	//위치정보를 불러오면 실행되는 콜백함수
		firstLoad = true;
		positionDeny = false;
		centerLat = pos.coords.latitude
		centerLng = pos.coords.longitude
		panTo(centerLat, centerLng)
		var imageSrc = '/static/img/myPoint.png', // 마커이미지의 주소입니다    
			imageSize = new kakao.maps.Size(16, 16), // 마커이미지의 크기입니다
			imageOption = { offset: new kakao.maps.Point(15, 42) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

		var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
			markerPosition = new kakao.maps.LatLng(centerLat, centerLng); // 마커가 표시될 위치입니다	

		var marker = new kakao.maps.Marker({
			map: map,
			position: markerPosition,
			image: markerImage

		});
		myPositionMarker.push(marker);
		firstLoad = true;
	}

	function error(error) {	//위치 정보를 불러오지 못할 때 실행되는 함수
		positionDeny = true;
		switch (error.code) {
			case 1: alert("위치 제공을 차단하셨습니다. 브라우저 설정을 통해 위치설정을 허용해주세요.") //사용자가 차단했을 시

				break;
			case 2: alert("위치 정보가 제공되지 않는 기기이거나 위치 제공 기능이 꺼져있습니다.") //위치 기능이 꺼져있거나 지원하지 않는 기기일 시

				break;

			default:
				break;
		}
		firstLoad = true;
		sendAddress();
	}

	myPosition();
	var clusterer = new kakao.maps.MarkerClusterer({
		map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
		averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
		minLevel: 5 // 클러스터 할 최소 지도 레벨 
	});
	clusterer.setMinClusterSize(1); //판매처가 1개여도 지도레벨이 5이상이면 클러스터러로 표현.



	$(".btn_close").click(function () {	//오늘하루 보지 않기 버튼.
		setCookieMobile("todayCookie", "done", 1);
		$("#noticeClose").click();
	});
	$("#notice").click(function () {
		$("#scrollImg").css("display", "block")
	})
	$(".modal-content").click(function () {
		$("#scrollImg").fadeOut(400)

	})
	$(".modal-body").on("scroll", function () {
		$("#scrollImg").fadeOut(400)
	});

	function setCookieMobile(name, value, expiredays) { //1일짜리 쿠키 생성.
		var todayDate = new Date();
		todayDate.setDate(todayDate.getDate() + expiredays);
		document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
	}
	function getCookieMobile() {
		var cookiedata = document.cookie;
		if (cookiedata.indexOf("todayCookie=done") < 0) {	//쿠키가 없으면 공지 띄움
			$("#notice").click();
		}
	}
	getCookieMobile();
	//요일에 따른 상단바 정보 변경
	var day = new Date;
	var today = day.getDay();
	if (today == 0) {
		$("#date").text("일요일")
		$("#firstSpan").text("주말은 ")
		var allPeople = '<span id="weekendBuy">모든 국민 </span><span>구매 가능</span>'

		$("#firstSpan").after(allPeople)

	}
	if (today == 1) {
		$("#date").text("월요일")
		$("#frontBirth").text("1")
		$("#behindBirth").text("6")
	}
	if (today == 2) {
		$("#date").text("화요일")
		$("#frontBirth").text("2")
		$("#behindBirth").text("7")
	}
	if (today == 3) {
		$("#date").text("수요일")
		$("#frontBirth").text("3")
		$("#behindBirth").text("8")

	}
	if (today == 4) {
		$("#date").text("목요일")
		$("#frontBirth").text("4")
		$("#behindBirth").text("9")
	}
	if (today == 5) {
		$("#date").text("금요일")
		$("#frontBirth").text("0")
		$("#behindBirth").text("5")
	}
	if (today == 6) {
		$("#date").text("토요일")
		$("#firstSpan").text("주말은 ")
		var allPeople = '<span id="weekendBuy">모든 국민 </span><span>구매 가능</span>'

		$("#firstSpan").after(allPeople)

	}


	function panTo(lat, lng) {
		// 이동할 위도 경도
		var moveLatLon = new kakao.maps.LatLng(lat, lng);

		// 지도 중심을 부드럽게 이동
		// 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동
		map.panTo(moveLatLon);
	}



	// 주소로 좌표를 검색
	function addressSearch(address) {
		centerChBtn = true;
		var ps = new kakao.maps.services.Places();
		if (!address.replace(/^\s+|\s+$/g, '')) {
			alert('키워드를 입력해주세요!');
			return false;
		}
		// 키워드로 장소를 검색
		ps.keywordSearch(address, placesSearchCB);

		// 키워드 검색 완료 시 호출되는 콜백함수
		function placesSearchCB(data, status, pagination) {
			if (status == "ZERO_RESULT") {	//데이터가 없을 시 안내
				alert("찾으시는 장소가 없습니다")
				return
			}
			if (status === kakao.maps.services.Status.OK) {
				$("#address").blur(); //인풋창 포커스아웃.
				// 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
				// LatLngBounds 객체에 좌표를 추가
				var bounds = new kakao.maps.LatLngBounds();

				for (var i = 0; i < data.length; i++) {
					bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
				}

				// 검색된 장소 위치를 기준으로 지도 범위를 재설정
				map.setLevel(4);
				map.setBounds(bounds);
			}
		}

	}

	$("#address").keyup(function () {
		if (window.event.keyCode == 13) {
			var keyword = document.getElementById('address').value;


			// 엔터키가 눌렸을 때 실행할 내용
			addressSearch($("#address").val());
		}
	})


	// 십진수를 라디안으로 변환
	function deg2rad(deg) {
		return (deg * Math.PI / 180.0);
	}

	// 라디안을 십진수로 변환
	function rad2deg(rad) {
		return (rad * 180 / Math.PI);
	}

	//현 위치와 목적지의 거리 계산
	function distance(lat1, lon1, lat2, lon2) {
		if (JSON.stringify(lat2) == "null") {
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

	//입고 날짜 보기 쉽게 변경
	function dateCal(i) {
		if (i != "입고 대기") {
			var nowDate = new Date(i.substr(0, 4), (i.substr(4, 2) - 1), i.substr(6, 2), i.substr(8, 2), i.substr(10, 2))
			var today = new Date();
			var betweenDay = (today.getTime() - nowDate.getTime()) / 1000 / 60 / 60 / 24;
			if (betweenDay >= 1) {
				return Math.round(betweenDay) + "일 전 입고"
			} else {
				betweenDay = betweenDay * 24;
				if (betweenDay >= 1 && betweenDay < 24) {
					return Math.round(betweenDay) + "시간 전 입고"
				} else {
					betweenDay = betweenDay * 60;
					return Math.round(betweenDay) + "분 전 입고"
				}
			}
		} else {
			return i
		}
	}

	//하단의 판매처 목록에 들어갈 태그들
	function contentListFnc(i, statColor, count) {
		var contentList = '<li id="storename' + count + '" class="storeLi">' +
			'<div class="storeName">' + i.name + '</div>' +
			'<div class="distanceMe">' + i.code + '</div>' +
			'<div class="remainStat"><div style="background : ' + statColor + ';" class="realStat">' + i.remain_stat + '</div></div>' +
			'<div class="stockTime">' + i.type + '</div></li>'

		return contentList
	}

	//오버레이 생성
	function contentListFnc2(i, statColor) {
		var content;
		if (!i.avgTime) { //평균 입고 시간 기록이 없을 때.
			content = '<div id="wrap" class="wrap">' +
				'    <div class="info">' +
				'        <div id="' + i.addr + '" class="title">' +
				i.name +
				'       </div>' +
				'        <div class="body">' +
				'            <div class="desc">' +
				'                <div id="overlayAddress" class="ellipsis">' + i.addr + '</div>' +
				'                <div id="overlayDistance" class="jibun ellipsis">' + i.code + '</div>' +
				'                <div id="overlayStock" class="jibun ellipsis">' + i.type + '</div>' +
				'                <div id="overlayStat" style="background : ' + statColor + '" class="jibun ellipsis">' + i.remain_stat + '</div>' +
				'                <div>' +
				'					  <a href="https://map.kakao.com/link/to/' + i.name + "," + i.lat + "," + i.lng + '" id="openNavi" target="_blank" class="link">길찾기</a></div>' +
				'            </div>' +
				'        </div>' +
				'    </div>' +
				'</div>';

		} else {
			content = '<div id="wrap" class="wrap">' +
				'    <div class="info">' +
				'        <div id="' + i.addr + '" class="title">' +
				i.name +
				'       </div>' +
				'        <div class="body">' +
				'            <div class="desc">' +
				'                <div id="overlayAddress" class="ellipsis">' + i.addr + '</div>' +
				'                <div id="overlayDistance" class="jibun ellipsis">' + i.code + '</div>' +
				'                <div id="overlayStock" class="jibun ellipsis">' + i.type + '</div>' +
				'                <div id="overlayStat" style="background : ' + statColor + '" class="jibun ellipsis">' + i.remain_stat + '</div>' +
				'                <div><div id="avgTime">최근 ' + i.day + "일간 평균 입고 시간 - " + i.avgTime + '</div> ' +
				'					  <a href="https://map.kakao.com/link/to/' + i.name + "," + i.lat + "," + i.lng + '" id="openNavi" target="_blank" class="link">길찾기</a></div>' +
				'            </div>' +
				'        </div>' +
				'    </div>' +
				'</div>';
		}
		return content;
	}

	//메인함수-판매처 정보 로드
	function sendAddress() {
		$(".storeLi").remove();
		$(".loading").css("display", "block")
		$("#centerChange").css("display", "none");
		var latlng = [map.getCenter().getLat(), map.getCenter().getLng()]
		var latlngJson = JSON.stringify(latlng)
		$.ajax({
			url: '/address',
			type: 'post',
			data: latlngJson, //문자열 배열을 보내기전에 json문자열로 변환해야 에러가 안난다. 그냥 문자열은 안해도 됐는데 배열을 해야한다. 이유는 모름.

			contentType: 'application/json;charset=UTF-8',
			success: function (data) {

				result = JSON.parse(data);
				//약국이 없을 때
				if (Object.keys(result).length == 0) { //객체 배열은 일반length가 안먹힘
					$(".loading").css("display", "none")
					var noStores = '<div class="storeLi" style="position : absolute; left : 50%; top : 50%; margin-left : -77px">근처에 약국이 없습니다</div>'
					$(".storeList").append(noStores)
					return

				} else {


					beforeMarker = []; //마커리스트와 오버레이 리스트 초기화
					overlayList = [];
					clusterer.clear(); //전에 있던 마커들 삭제

					result.forEach(i => {

						//품절제외
						if (excepted == true && i.remain_stat != "plenty" && i.remain_stat != "some" && i.remain_stat != "few") {
							return true;
						}
						//가끔 위도경도가 없는 판매처 정보가 넘어온다..
						if (!i.lat) return true;

						if (!i.stock_at || JSON.stringify(i.stock_at) == "null") {
							i.type = "입고 대기";
							var distanceResult = Math.round(distance(centerLat, centerLng, i.lat, i.lng)) //위도 경도 미터로 변환
							i.code = distanceResult;
						} else {
							//나중에 입고순으로 정렬을 해야하기 때문에 원본데이터인 stock_at는 냅두고 type에 데이터를 넣는다.
							var test2 = i.stock_at.substr(0, 4)
							test2 += i.stock_at.substr(5, 2)
							test2 += i.stock_at.substr(8, 2)
							test2 += i.stock_at.substr(11, 2)
							test2 += i.stock_at.substr(14, 2)
							i.type = test2
							var distanceResult = Math.round(distance(centerLat, centerLng, i.lat, i.lng))
							i.code = distanceResult;
						}

						//시간을 몇 분 전 몇 시간 전으로 변환.
						i.type = dateCal(i.type)


						//빈 데이터들 처리
						i.created_at = JSON.stringify(i.created_at) == "null" ? "입고 대기" : i.created_at;

						//거리 데이터를 km, m로 변환
						if (positionDeny == false) {
							if (i.code != 0) {
								if (i.code >= 1000) {
									i.code = i.code / 1000
									i.code = i.code.toFixed(1) + "km"
								} else {
									i.code = i.code + "m"
								}
							}
						} else {
							i.code = 0
							//사용자가 위치제공 차단했을 시 거리는 0으로 표현
						}

						var markerColor;
						var jsonRemain = JSON.stringify(i.remain_stat)
						var statColor;
						//스위치를 통해 마커 색깔과 재고 색깔을 정해준다.
						switch (jsonRemain) {
							case '"plenty"': i.remain_stat = "충분", markerColor = "green.png", statColor = "#009473"

								break;
							case '"some"': i.remain_stat = "보통", markerColor = "yellow.png", statColor = "#F0C05A"

								break;
							case '"few"': i.remain_stat = "부족", markerColor = "red.png", statColor = "#DD4124"

								break;
							case '"empty"': i.remain_stat = "없음", markerColor = "gray.png", statColor = "#84898C"

								break;
							case '"break"': i.remain_stat = "없음", markerColor = "gray.png", statColor = "#84898C"

								break;
							case "null": i.remain_stat = "없음", markerColor = "gray.png", statColor = "#84898C"

								break;

							default:
								break;
						}
						if (!i.remain_stat) {
							i.remain_stat = "없음"
							markerColor = "gray.png"
							statColor = "#84898C"
						}

						//마커 생성
						var imageSrc = '/static/img/' + markerColor,
							imageSize = new kakao.maps.Size(28, 36),
							imageOption = { offset: new kakao.maps.Point(15, 42) };

						var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
							markerPosition = new kakao.maps.LatLng(i.lat, i.lng);

						var marker = new kakao.maps.Marker({
							position: markerPosition,
							image: markerImage

						});

						//오버레이 생성
						var content = contentListFnc2(i, statColor)

						// 마커 위에 커스텀오버레이를 표시합니다
						// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
						var overlay = new kakao.maps.CustomOverlay({
							content: content,
							position: markerPosition,
							clickable: true
						});
						overlay.setZIndex(10)

						//마커의 클릭이벤트. 생성된 오버레이를 없애고 새 오버레이를 띄운다.
						kakao.maps.event.addListener(marker, 'click', function () {
							//좌표로 이동
							panTo(i.lat, i.lng);
							if (beforeOverlay[0]) {
								beforeOverlay[0].setMap(null);
							}
							beforeOverlay = [];
							overlay.setMap(map);
							beforeOverlay.push(overlay);

						});
						//배열에 추가
						beforeMarker.push(marker);
						overlayList.push(overlay);
					});

					clusterer.addMarkers(beforeMarker);
					beforeClusterer.push(clusterer)
					//딥카피를 통해 정렬할 때 쓰일 객체를 생성.
					result2 = JSON.parse(JSON.stringify(result))


					//활성화된 정렬메뉴를 실행.
					if (menuSwitch == "stock") {
						recentStock();
					} else {

						nearby();
					}
					$(".loading").css("display", "none")

				}
			},

			error: function () {
				alert("새로고침 해주세요");
			}

		})
	}

	//입고 순 정렬
	function recentStock() {
		//스크롤 div 재생성
		$(".scrollDiv").remove();
		var scrollDiv = '<div class="scrollDiv"><ul class="storeList"></ul></div>'
		$("#firstBar").after(scrollDiv)
		//버튼 클릭유무에 따른 css변경
		$("#recentStock").css("border-bottom", "4px solid #C0D725")
		$("#recentStock").css("color", "#C0D725")
		$("#nearby").css("color", "#F1EEE6")
		$("#nearby").css("border-bottom", "none")

		//약국 없을시
		if (Object.keys(result).length == 0) {
			var noStores = '<div class="storeLi" style="position : absolute; left : 50%; top : 50%; margin-left : -77px">근처에 약국이 없습니다</div>'

			$(".storeList").append(noStores)
			return
		}


		result.forEach(i => {

			if (!i.stock_at || JSON.stringify(i.stock_at) == "null") {
				i.type = 999; //입고 순 정렬을 위해 큰 수를 넣어 null값을 맨 밑으로 보냄.
			} else {
				var test2 = i.stock_at.substr(0, 4)
				test2 += i.stock_at.substr(5, 2)
				test2 += i.stock_at.substr(8, 2)
				test2 += i.stock_at.substr(11, 2)
				test2 += i.stock_at.substr(14, 2)
				i.type = test2
			}
		})

		//입고순으로 정렬
		result.sort(function (a, b) {
			return b.type - a.type;
		})

		var count = 1;
		var divCount = 0;

		//무한 스크롤 
		function scrollContent() {
			$(".loading").css("display", "block")

			var counter = 0; //n번쨰 스크롤의 약국 수를 카운트 한다.
			var breakCount = 0; //전체 약국 수를 카운트 한다.

			result.some(i => {
				if (divCount > counter) { //전 스크롤에서 약국을 n개 생성했다면 이번 스크롤에서 n번쨰인덱스부터 n개더 생성해야하므로 n번쨰 인덱스까지 반복문을 Continue한다.
					counter++;
					return false;
				}
				//품절제외 버튼을 눌렀을 때 해당되지 않는 약국정보는 Continue한다.
				if (excepted == true && i.remain_stat != "충분" && i.remain_stat != "부족" && i.remain_stat != "보통") {
					counter++;
					divCount++
					return false;
				}
				//가끔 좌표 정보가 없는 약국이 있어서 제외 시킨다.
				if (!i.lat) {
					counter++;
					divCount++;
					return false;
				}
				if (i.type == 999) i.type = "입고 대기" //맨 밑으로 온 null값을 입고대기로 변경
				i.type = dateCal(i.type)

				var statColor;
				//재고 div 색 정해주기
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


				var contentList = contentListFnc(i, statColor, count)

				$(".storeList").append(contentList)

				var content = contentListFnc2(i, statColor)

				var position = new kakao.maps.LatLng(

					i.lat, i.lng
				);
				var overlay = new kakao.maps.CustomOverlay({
					content: content,
					position: position,
					clickable: true
				});
				overlay.setZIndex(10)

				//정렬된 목록의 클릭 이벤트. 확대 레벨이 5이상인 경우 3레벨로 확대 후 오버레이 생성, 5레벨 이상일 때는 클러스터러로 표현되기 때문에 확대해서 마커 단위로 바꿔준 후 오버레이 생성.
				$("#storename" + count).click(function () {

					if (map.getLevel() > 4) {
						map.setLevel(3);
					}
					panTo(i.lat, i.lng);
					if (beforeOverlay[0]) {
						beforeOverlay[0].setMap(null);
					}
					beforeOverlay = [];
					overlay.setMap(map);
					beforeOverlay.push(overlay);
				})

				count++;
				divCount++;
				counter++;
				breakCount++;
				//리스트 11개까지만 생성. 
				if (Object.keys(result).length < 11 && breakCount == Object.keys(result).length) return true;
				if (breakCount == 11) {

					return true;
				}

			})
			$(".loading").css("display", "none")
		}
		scrollContent();
		$(".scrollDiv").on("scroll", function () {
			var scrollHeight = $(".storeList").height();
			var scrollPosition = $(".scrollDiv").height() + $(".scrollDiv").scrollTop();
			//스크롤이 바닥에서 50px 미만으로 들어오면 새로운 리스트 생성
			if (scrollPosition > scrollHeight - 50 && divCount != Object.keys(result).length) {
				scrollContent();
			}
		});

		menuSwitch = "stock";
		$(".slideUp").scrollTop(0);
	}

	//거리순 정렬 내용은 거리순 정렬빼고는 위와 같다.
	function nearby() {
		if (positionDeny == true) {
			alert("위치 제공을 차단하셨거나 지원하지 않습니다.")
			return
		}

		$(".scrollDiv").remove();
		var scrollDiv = '<div class="scrollDiv"><ul class="storeList"></ul></div>'
		$("#firstBar").after(scrollDiv)
		$("#nearby").css("border-bottom", "4px solid #C0D725")
		$("#nearby").css("color", "#C0D725")
		$("#recentStock").css("color", "#F1EEE6")
		$("#recentStock").css("border-bottom", "none")

		if (Object.keys(result).length == 0) {
			var noStores = '<div class="storeLi" style="position : absolute; left : 50%; top : 50%; margin-left : -77px">근처에 약국이 없습니다</div>'
			$(".storeList").append(noStores)
			return
		}


		result2.forEach(i => {
			var distanceResult = Math.round(distance(centerLat, centerLng, i.lat, i.lng))
			i.code = distanceResult;

		})

		result2.sort(function (a, b) {
			return a.code - b.code
		})

		var count = 1;
		var divCount = 0;

		function scrollContent() {
			$(".loading").css("display", "block")

			var counter = 0;
			var breakCount = 0;


			result2.some(i => {
				if (divCount > counter) {
					counter++;
					return false;
				}

				if (excepted == true && i.remain_stat != "충분" && i.remain_stat != "부족" && i.remain_stat != "보통") {
					counter++;
					divCount++
					return false;
				}
				if (!i.lat) {
					counter++;
					divCount++;
					return false;
				}
				if (positionDeny == false) {
					if (i.code != 0) {
						if (i.code >= 1000) {
							i.code = i.code / 1000
							i.code = i.code.toFixed(1) + "km"
						} else {
							i.code = i.code + "m"
						}
					}
				} else {
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

				var contentList = contentListFnc(i, statColor, count)

				$(".storeList").append(contentList)

				var content = contentListFnc2(i, statColor)

				var position = new kakao.maps.LatLng(
					i.lat, i.lng
				);
				var overlay = new kakao.maps.CustomOverlay({
					content: content,
					position: position,
					clickable: true
				});
				overlay.setZIndex(10)
				$("#storename" + count).click(async function () {
					if (map.getLevel() > 4) {
						map.setLevel(3);
					}
					panTo(i.lat, i.lng);
					if (beforeOverlay[0]) {
						beforeOverlay[0].setMap(null);
					}
					beforeOverlay = [];
					await overlay.setMap(map);
					beforeOverlay.push(overlay);

				})
				count++;


				divCount++;
				counter++;
				breakCount++;


				if (Object.keys(result).length < 11 && breakCount == Object.keys(result).length) return true;
				if (breakCount == 11) {

					return true;
				}

			})
			$(".loading").css("display", "none")


		}
		scrollContent();
		$(".scrollDiv").on("scroll", function () {
			var scrollHeight = $(".storeList").height();
			var scrollPosition = $(".scrollDiv").height() + $(".scrollDiv").scrollTop();
			if (scrollPosition > scrollHeight - 50 && divCount != Object.keys(result).length) {
				scrollContent();
			}
		});


		menuSwitch = "distance";
		$(".slideUp").scrollTop(0);
	}


	$('#recentStock').click(function () {
		recentStock();
	})
	$('#nearby').click(function () {
		nearby();
	})


	//새로고침 버튼
	$("#refresh").click(function () {
		$("#refresh").css("background-color", "#0f4c81");
		sendAddress();
		setTimeout(() => {
			$("#refresh").css("background-color", "white");
		}, 600);

	})

	//내 위치 버튼 , 눌린 상태에서 누르면 마커가 제거되면서 비활성 아이콘으로 바뀜.
	$("#myPosition").click(function () {
		if (myPositionBtn == false) {
			myPositionBtn = true
			if (myPositionMarker[0]) {
				myPositionMarker[0].setMap(null)
			}
			myPosition();
			$("#myPositionImg").attr("src", "/static/img/myPositionClicked.png")
			$("#myPosition").css("background", "#0f4c81")
		} else {
			$("#myPositionImg").attr("src", "/static/img/myPosition.png")
			$("#myPosition").css("background", "white")
			if (myPositionMarker[0]) {
				myPositionMarker[0].setMap(null)
			}
			if (myPositionMarker[1]) {
				myPositionMarker[1].setMap(null)
			}
			myPositionBtn = false;
			myPositionMarker = [];
		}
	})

	//인풋창 돋보기 클릭시 검색.
	$("#searchIcon").click(function () {
		addressSearch($("#address").val())
	})

	//품절제외 버튼.
	$("#exceptedOn").click(function () {
		excepted = true
		if (beforeOverlay[0]) beforeOverlay[0].setMap(null)
		sendAddress();
	})
	$("#exceptedOff").click(function () {
		excepted = false
		if (beforeOverlay[0]) beforeOverlay[0].setMap(null)
		sendAddress();
	})



	//목록열기 버튼. 아이패드 크기 이상의 기기에서는 목록의 width값이 100%가 아니라서 양옆에 버튼과 재고 알림박스는 슬라이드 기능 off
	$('#reverseSlideContentUp').on('click', function () {
		if ($('#reverseSlideContentUp').text() == "목록 열기") {
			if (document.getElementsByClassName("storeList")[0].childElementCount == 0) {
				recentStock();
			}
			$('.slideUp').slideDown();
			$('#reverseSlideContentUp').html("목록 닫기")
			if (window.innerWidth < 1024) {
				$('#myPosition').animate({ bottom: "42%" }, 400);
				$('.remainInfo').animate({ bottom: "42%" }, 400);
				var height = window.innerHeight * (42 / 100) + 42;

				$('#refresh').animate({ bottom: height + "px" }, 400);
				$('#reverseSlideContentUp').animate({ bottom: "42%" }, 400);
			} else {
				$('#reverseSlideContentUp').animate({ bottom: "38%" }, 400);
			}

		} else {
			$('.slideUp').slideUp();
			$('#myPosition').animate({ bottom: "18px" }, 400);
			if (window.innerWidth < 1024) {
				$('#refresh').animate({ bottom: "60px" }, 400);
			}
			$('#reverseSlideContentUp').animate({ bottom: "18px" }, 400);
			$('.remainInfo').animate({ bottom: "18px" }, 400);
			$('#reverseSlideContentUp').html("목록 열기")
		}
	});


	//지도 클릭 이벤트 , 오버레이 제거.
	var clickHandler = function (e) {

		if (beforeOverlay[0]) beforeOverlay[0].setMap(null)
	};
	kakao.maps.event.addListener(map, 'click', clickHandler)

	kakao.maps.event.addListener(map, 'zoom_changed', function () {

		// 지도의 현재 레벨을 얻어온다. 확대나 축소시에 레벨이 5이상이면 오버레이 제거. 클러스터러로 표시되기 때문.
		if (map.getLevel() > 4) {

			if (beforeOverlay[0]) beforeOverlay[0].setMap(null)
		}


	});
	//카카오맵의 타일이 로드될 때마다 판매처 정보 로드.
	kakao.maps.event.addListener(map, 'tilesloaded', function () {
		if (firstLoad == true) sendAddress();

	});

	$(window).resize(function () {
		// width값을 가져오기
		var width_size = window.innerWidth;

		// 아이패드 가로로 전환시 css 크기에 맞게 재적용.
		if (width_size >= 1024) {
			$('#refresh').css("bottom", "85px");
			$('#myPosition').css("bottom", "18px");
			$(".remainInfo").css("bottom", "18px")
		}
		if (width_size >= 1024 && $('#reverseSlideContentUp').text() == "목록 닫기") {
			$('#reverseSlideContentUp').css("bottom", "38%")
		}
		// 아이패드 세로로 전환시 css 크기에 맞게 재적용.
		if (width_size < 1024 && $('#reverseSlideContentUp').text() == "목록 닫기") {
			$('#reverseSlideContentUp').css("bottom", "42%")
			var height = window.innerHeight * (42 / 100) + 42;
			$('#refresh').css("bottom", height + "px");
			$('#myPosition').css("bottom", "42%");
			$(".remainInfo").css("bottom", "42%")
		}
	})

});
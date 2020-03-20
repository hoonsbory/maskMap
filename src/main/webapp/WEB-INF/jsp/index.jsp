<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html style="height : 100%">
<head>
<meta charset="UTF-8">
<meta property="og:site_name" content="마스크팜"/> 
<meta property="og:type" content="website"/>
<meta property="og:title" content="마스크맵" />
<meta property="og:description" content="공적마스크 정보를 입고순, 거리순으로 확인할 수 있습니다" />
<meta property="og:image" content="/static/img/kakaoThumbnail.png" />
<meta property="og:url" content="https://mask-pharm.shop"/>
<meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=0">
<meta name="google-site-verification" content="E3ACIwfAxQOFup0nCXlippbXYapvM0qgGb7gtnu5eDg" />
<meta name="naver-site-verification" content="5dc3a557afdd3f611a7539f850a0d9a895ac7867" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
<link rel="apple-touch-icon" sizes="180x180" href="/static/img/favicon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/static/img/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/static/img/favicon/favicon-16x16.png">
<link rel="manifest" href="/static/img/favicon/site.webmanifest">
<link rel="mask-icon" href="/static/img/favicon/safari-pinned-tab.svg" color="#5bbad5">
<link rel="shortcut icon" href="/static/img/favicon/favicon.ico">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="msapplication-config" content="/static/img/favicon/browserconfig.xml">
<meta name="theme-color" content="#ffffff">
<meta name="author" content="신재훈" />
<meta name="description" content="공적마스크 정보를 입고순, 거리순으로 확인할 수 있습니다" />
<meta name="keywords" content="공적마스크,마스크,지도,마스크지도,마스크맵,코로나,코로나바이러스,약국,우체국" />
<link rel="canonical" href="https://mask-pharm.shop">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2169105020527d66bfc410aff25c58e1&libraries=services"></script>
<script src="/static/js/main.js"></script>
<title>마스크팜</title>
<link rel="stylesheet" type="text/css" href="/static/css/main.css">


</head>

<body style="height : 100%">
<!-- Modal -->

<div class="modal fade" id="myModal" role="dialog"> <!-- 사용자 지정 부분① : id명 -->

    <div class="modal-dialog">

    

      <!-- Modal content-->

      <div class="modal-content">

        <div class="modal-header">

          <button type="button" class="close" data-dismiss="modal">×</button>

          <h4 class="modal-title">Notice</h4> <!-- 사용자 지정 부분② : 타이틀 -->

        </div>

        <div class="modal-body">

          <div class="modal-bodyDiv">
			<p class="body-title">공지</p>
			<p>본 데이터는 실제 마스크 정보와 최소 5분 이상 차이가 날 수 있습니다. <br><br>
				정부에서 제공하는 공공데이터이지만
			 즉각적으로 갱신되는 것이 아니기에 참고 지표로만 삼아주세요. <br><br>
			 약사님들에게는 그 어떤 책임도 없으니 문제를 제기하기보단 따뜻한 응원의 말 한마디 부탁드립니다.
			</p>	
		  </div>
		  
          <div class="modal-bodyDiv">
			<p class="body-title">업데이트</p>
			<p>마스크팜은 현재 초기 개발 단계로 추후 편의성을 고려해 업데이트 예정입니다. <br><br>
				다음 업데이트 예정 : 거리 계산 위치 자유 변경 / pc용 디자인 적용</p>	
		  </div>
        </div>

        <div class="modal-footer">
			<div class="footerInfo">
				<p>개발 및 기획 - 신재훈</p>
				<p>UI/UX 디자인 - 신나래</p>
				<p>데이터 제공 - 건강보험심사평가원</p>
				<p>에러 및 개선사항 건의 - tonymkcv93@gmail.com</p>
			</div>
        </div>

      </div>

    </div>

  </div>



	<div id="map" style="width:100%;height:100%;"></div>
	<div id="searchBar">
<input placeholder="목적지를 입력하세요" type="text" id="address" value="" />
<img id="searchIcon" src="/static/img/searchIcon.png" />
</div>
<img class="loading" src="/static/img/loading25.gif" style="display : none" />	
<div id="topBar">
	<span id="date" class="topBarDate">

	</span>
	<div id="buyDate" class="topBarDate">
		<span id="firstSpan">끝자리 <span id="frontBirth"></span> , <span id="behindBirth"></span> 년생 구매</span>
	</div>
	<span id="mainTitle">
		마스크<span style="color : #C0D725">팜</span>
	</span>
	<button id="notice" type="button" data-toggle="modal" data-target="#myModal"><img width="20px" src="/static/img/noticeIcon.png" /></button>

	
</div>
<p id="excepted2" class="btn-switch">					
	<input type="radio" id="yes" name="switch" class="btn-switch__radio btn-switch__radio_yes" />
	<input type="radio" checked id="no" name="switch" class="btn-switch__radio btn-switch__radio_no" />		
	<label for="yes" id="exceptedOn" class="btn-switch__label btn-switch__label_yes"><span class="btn-switch__txt">품절포함</span></label>
	<label for="no" id="exceptedOff" class="btn-switch__label btn-switch__label_no"><span class="btn-switch__txt">품절제외</span></label>							
  </p>
<!-- <button id="excepted">품절 제외 : OFF</button> -->
<div id="centerChange">
	<img width="14px" src="/static/img/searchIcon.png"/>
현 위치에서 검색
</div>
<div class="remainInfo"><img width="100px" src="/static/img/remain-stat.png"/></div>
<button id="reverseSlideContentUp">목록 열기</button>
<div id="myPosition"><img id="myPositionImg" width="30px" src="/static/img/myPosition.png" /></div> 
<!-- <button style="display : none" id="reverseSlideContentUp">Reverse Slide Up</button> -->
<div class="slide slideUp">
	<div id="firstBar">
	<ul id="BarUl">
		<a id="recentStock" style="width : 49%">입고순</a>
		<div id="centerLine"></div>
		<a id="nearby" style="width : 49%">거리순</a>
	</ul>	
	
	
	
	<!-- <div><img src="/static/img/loading25.gif" /></div> -->
	</div><div class="scrollDiv">
		<ul class="storeList"></ul>
	</div>
</div>
</body>
</html>

<h1 align="center">Welcome to MaskPharm   👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

>## Public Mask Stores Information Web 공적 마스크 판매처 정보 제공 웹

### `Description`
- Use Kakao Map Api
- Responsive Web
- Get json data from the public data portal site at 04:00 AM every day(using crontab), after parsing, calculating the average incoming time and storing it in the database.
  <br> `Api에서 받아온 json데이터를 파싱 후 최대 7일간의 평균 입고 시간을 계산하여 크론탭으로 매일 새벽 4시에  DB에 Update함.`
- Sort stores by Distance and Incoming time(Scroll Paging)

### `Stack`
- <strong>framework</strong> : Spring Boot


- <strong>Docker-load balancing</strong>(4 jdk containers) with Nginx(reverse proxy)


- <strong>CI</strong> : travis CI 


- <strong>storage</strong> : AWS S3


- <strong>DB</strong> : Mysql


- <strong>deploy</strong> : AWS CodeDeploy

### Images

<img src="https://cdn.jsdelivr.net/gh/hoonsbory/MyGitPage@gh-pages/images/mask01.jpg">
<div>
<img width="400px" height="600px" src="https://cdn.jsdelivr.net/gh/hoonsbory/MyGitPage@gh-pages/images/mask02.jpg">
<img width="400px" height="600px" src="https://cdn.jsdelivr.net/gh/hoonsbory/MyGitPage@gh-pages/images/mask03.jpg">
</div>


### 🏠 [Homepage](https://mask-pharm.shop)
<img style="margin-top : 0px;" src="/src/main/resources/static/img/kakaoThumbnail.jpg" width="450px" height="300px" alt="maskpharm" />



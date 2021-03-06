package com.jaehoon.maskmap;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.jaehoon.maskmap.Entity.AvgTime;
import com.jaehoon.maskmap.Entity.CountUser;
import com.jaehoon.maskmap.Entity.StoreInfo;
import com.jaehoon.maskmap.Repository.AvgTimeRepository;
import com.jaehoon.maskmap.Repository.CountUserRepository;
import com.jaehoon.maskmap.Repository.StoreInfoRepository;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

/**
 * HomeController
 */

@Controller
public class HomeController {
    @Autowired
    CountUserRepository countUserRepository;
    @Autowired
    StoreInfoRepository storeInfoRepository;
    @Autowired
    AvgTimeRepository avgTimeRepository;

    @RequestMapping(value = "/")
    public String home(HttpServletRequest request) {
        HttpSession session = request.getSession();
        // 세션이 생성되면 카운트
        if (session.getAttribute("count") == "count") {
            CountUser countUser = new CountUser();

            String ip = request.getHeader("X-Forwarded-For");

            if (ip == null) {
                ip = request.getHeader("Proxy-Client-IP");
            }
            if (ip == null) {
                ip = request.getHeader("WL-Proxy-Client-IP");
            }
            if (ip == null) {
                ip = request.getHeader("HTTP_CLIENT_IP");
            }
            if (ip == null) {
                ip = request.getHeader("HTTP_X_FORWARDED_FOR");
            }
            if (ip == null) {
                ip = request.getRemoteAddr();
            }

            // 우리집 아이피 제외
            if (ip.contains("192.168.35") || ip.equals("127.0.0.1") || ip.equals("211.49.2.85")) {
                return "index";
            } else {
                countUser.setUserIP(ip);
                countUserRepository.save(countUser);

                session.setAttribute("count", "nocount");

            }

        }

        return "index";
    }

    @RequestMapping(value = "/address", method = RequestMethod.POST)
    @ResponseBody
    public String address(@RequestBody String[] address) {
        String url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=" + address[0]
                + "&lng=" + address[1] + "&m=1500";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8"))); // Response Header to
                                                                                                // UTF-8

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        String jsonStr = response.getBody();

        JSONObject jObject = new JSONObject(jsonStr);
        JSONArray jArray = jObject.getJSONArray("stores");

        String code = "";
        for (int i = 0; i < jArray.length(); i++) {
            JSONObject obj = jArray.getJSONObject(i);
            if (obj.get("code") instanceof Long) { // 공공데이터 중 같은 키값인데 어떤 것은 long타입 어떤 것은 String 타입이라 걸러줘야한다...
                int codeInt = obj.getInt("code");
                code = Integer.toString(codeInt);
            } else {

                code = obj.getString("code");
            }
            AvgTime avgTime = new AvgTime();
            if (!avgTimeRepository.findById(code).isPresent())
                continue; // code값이 없는 데이터도 존재하여 반복문을 건너뛰어준다...
            avgTime = avgTimeRepository.findById(code).get();
            obj.put("avgTime", avgTime.getAvgTime());
            obj.put("day", avgTime.getDay());
            // list.add(avgTime);
            jArray.put(i, obj);
        }
        jsonStr = jArray.toString();
        // map.put("stockList",list);
        return jsonStr;

    }

    // @RequestMapping(value = "/autoDataInsert")
    // // 데이터 업로드. mysql서버로 쓰고 있는 ec2에서 매일 새벽4시에
    // // curl 요청을 보내 업로드를 한다.
    // @ResponseBody
    // public void dataInsert() {
    //     for (int z = 1; z < 7; z++) {
    //         String url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?page=" + z + "&perPage=5000";
    //         RestTemplate restTemplate = new RestTemplate();
    //         HttpHeaders headers = new HttpHeaders();
    //         headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8"))); // Response Header
    //         // to
    //         // UTF-8

    //         ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

    //         String jsonStr = response.getBody();

    //         JSONObject jObject = new JSONObject(jsonStr);

    //         JSONArray jArray = jObject.getJSONArray("sales");

    //         Loop1: for (int i = 0; i < jArray.length(); i++) {
    //             JSONObject obj = jArray.getJSONObject(i);
    //             String code = obj.getString("code");

    //             if (obj.isNull("stock_at"))
    //                 // 입고 기록이 없는 판매처는 제외
    //                 continue Loop1;
    //             String stock_at = obj.getString("stock_at");
    //             StoreInfo storeinfo = new StoreInfo();

    //             final String stock_at2 = stock_at.substring(5, 7) + stock_at.substring(8, 10)
    //                     + stock_at.substring(11, 13) + stock_at.substring(14, 16);
    //             // 입고 시간을 월,일,시,분으로 저장.
    //             List<StoreInfo> list = new ArrayList<>();

    //             list = storeInfoRepository.findByCode(code);

    //             for (StoreInfo data : list) {
    //                 // 어제 입고한 이후로 입고가 되지않아 같은 데이터가 또 들어올 수 있으므로 해당
    //                 // 판매처에 대한 기록을 찾아와 반복문을 통해 이미 있는 데이터인지 검증한다.
    //                 if (data.getStockTime().equals(stock_at2)) {
    //                     continue Loop1;
    //                 }
    //             }

    //             if (list.size() == 7) {
    //                 // 총 7일간의 데이터만을 수집하므로 이미 7일간의 데이터가 있다면 가장 오래된 데이터를 삭제한 후
    //                 // 새 데이터를 넣는다.
    //                 Collections.sort(list);

    //                 // 입고시간을 기준으로 오름차순 정렬해준 후 가장 오래된 데이터에 새 데이터를 덮어 씌운다.
    //                 list.get(0).setStockTime(stock_at2);
    //                 storeInfoRepository.save(list.get(0));

    //                 continue Loop1;
    //                 // 새 데이터를 넣고 다음 루프로.

    //             }

    //             storeinfo.setCode(code);
    //             // 데이터가 7개가 아니고 중복도 없을 시에 저장.
    //             storeinfo.setStockTime(stock_at2);
    //             storeInfoRepository.save(storeinfo);

    //             double cal = 0;
    //             List<StoreInfo> list2 = new ArrayList<>();
    //             list2 = storeInfoRepository.findByCode(code);
    //             // 새로 들어온 데이터를 다시 가져와 리스트에 넣는다.

    //             for (StoreInfo data : list2) {

    //                 String a = data.getStockTime();
    //                 // 입고 시간에서 시, 분을 분리한다.
    //                 String b = a.substring(4, 6);
    //                 String c = a.substring(6, 8);

    //                 cal = cal + (Integer.parseInt(b) * 60 + Integer.parseInt(c));
    //                 // 시간에 60을 곱한 후 분과 더해주어 단위를 맞춰준 후 반복문을 통해 더해준다.

    //             }
    //             double result = cal / list2.size() / 60;
    //             // n개의 입고시간데이터를 데이터 개수만큼 나눠준 뒤 60을 곱해 시 단위로 변환해준다.

    //             String str = Double.toString(Math.round(result * 100) / 100.0);
    //             // 변환된 시간의 소수점을 두자리까지 반올림해준다.

    //             String[] hour = str.split("\\.");
    //             // .과 같은 예약어를 구분자로 쓸때는 \\를 붙여준다.
    //             double min = 0;
    //             // 시간을 시 분으로 나누어 배열에 저장한다.
    //             if (hour[0].length() == 1) {
    //                 // 10시이전 즉 1~9에 시간에 한 해서 앞에 0을 붙여준다.
    //                 hour[0] = "0" + hour[0];
    //             }
    //             if (hour[1].length() == 1) {
    //                 // 분은 소수점이 1자리인 값에 대해서만 0을 붙여준다.
    //                 // 소수점은 분단위로 변환시켜야 하기때문에 미리 0을 붙여서 값을 맞춰준다.
    //                 hour[1] = hour[1] + "0";
    //             }
    //             min = Double.parseDouble(hour[1]) * 0.6;
    //             // 소수점에 0.6을 곱하여 분단위로 변환해준다. 위에서 0을
    //             // 붙여줘도 되고 여기서 6을 곱해줘도 값은 같다.
    //             min = Math.round(min);
    //             // 반올림해준다.
    //             int min2 = (int) min;
    //             String minStr = "";
    //             if (min2 < 10) {
    //                 minStr = "0" + Integer.toString(min2);
    //                 // 10보다 작은 값에 대해 0을 붙여준다.
    //             } else {
    //                 minStr = Integer.toString(min2);
    //             }
    //             String finalResult = hour[0] + ":" + minStr;
    //             // 평균 시간이 구해졌다.

    //             AvgTime avgTime = new AvgTime();

    //             avgTime.setCode(code);
    //             avgTime.setAvgTime(finalResult);
    //             avgTime.setDay(list2.size());
    //             // 평균시간과 리스트의 개수, 즉 데이터가 수집된 일 수를 저장한다.

    //             avgTimeRepository.save(avgTime);
    //         }

    //     }
    // }

}
package com.jaehoon.maskmap;

import java.nio.charset.Charset;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.jaehoon.maskmap.Entity.AvgTime;
import com.jaehoon.maskmap.Entity.CountUser;
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
                + "&lng=" + address[1] + "&m=2000";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8"))); // Response Header to
                                                                                                // UTF-8

        // UriComponents builder =
        // UriComponentsBuilder.fromHttpUrl(url).queryParam("_type",
        // "json").build(false); // 자동으로
        // encode해주는
        // 것을 막기
        // 위해
        // false

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        String jsonStr = response.getBody();

        JSONObject jObject = new JSONObject(jsonStr);
        JSONArray jArray = jObject.getJSONArray("stores");

        String code = "";
        for (int i = 0; i < jArray.length(); i++) {
            JSONObject obj = jArray.getJSONObject(i);
            System.out.println(1);
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
            System.out.println(2);
            obj.put("avgTime", avgTime.getAvgTime());
            obj.put("day", avgTime.getDay());
            // list.add(avgTime);
            jArray.put(i, obj);
        }
        jsonStr = jArray.toString();
        // map.put("stockList",list);
        return jsonStr;

    }
    @RequestMapping(value = "/test")
    @ResponseBody
    public void test() {
        CountUser countUser = new CountUser();
        countUser.setUserIP("118.176.170.81");
        countUserRepository.save(countUser);
    }
    // @RequestMapping(value = "/dataInsert")
    // @ResponseBody
    // public void dataInsert() {
    //     for (int z = 1; z < 7; z++) {
    //         String url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?page=" + z + "&perPage=5000";
    //         RestTemplate restTemplate = new RestTemplate();
    //         HttpHeaders headers = new HttpHeaders();
    //         headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8"))); // Response Header
    //                                                                                                 // to
    //                                                                                                 // UTF-8

    //         // UriComponents builder =
    //         // UriComponentsBuilder.fromHttpUrl(url).queryParam("_type",
    //         // "json").build(false); // 자동으로
    //         // encode해주는
    //         // 것을 막기
    //         // 위해
    //         // false

    //         ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

    //         String jsonStr = response.getBody();

    //         JSONObject jObject = new JSONObject(jsonStr);

    //         JSONArray jArray = jObject.getJSONArray("sales");

    //         Loop1: for (int i = 0; i < jArray.length(); i++) {
    //             JSONObject obj = jArray.getJSONObject(i);
    //             String code = obj.getString("code");

    //             if (obj.isNull("stock_at"))
    //                 continue Loop1;
    //             String stock_at = obj.getString("stock_at");
    //             StoreInfo storeinfo = new StoreInfo();

    //             // String d = a.substring(0, 4);
    //             // String e = a.substring(5, 7);
    //             // String f = a.substring(8, 10);
    //             // String b = a.substring(11, 13);
    //             // String c = a.substring(14, 16);

    //             final String stock_at2 = stock_at.substring(5, 7) + stock_at.substring(8, 10)
    //                     + stock_at.substring(11, 13) + stock_at.substring(14, 16);
    //             List<StoreInfo> list = new ArrayList<>();

    //             list = storeInfoRepository.findByCode(code);

    //             for (StoreInfo data : list) {
    //                 if (data.getStockTime().equals(stock_at2)) {
    //                     continue Loop1;
    //                 }
    //             }

    //             if (list.size() == 7) {
    //                 Collections.sort(list);

    //                 storeInfoRepository.deleteByStockTime(list.get(0).getStockTime());

    //                 storeinfo.setCode(code);
    //                 storeinfo.setStockTime(stock_at2);
    //                 storeInfoRepository.save(storeinfo);

    //                 continue Loop1;

    //             }

    //             storeinfo.setCode(code);
    //             storeinfo.setStockTime(stock_at2);
    //             storeInfoRepository.save(storeinfo);

    //             double cal = 0;
    //             List<StoreInfo> list2 = new ArrayList<>();
    //             list2 = storeInfoRepository.findByCode(code);

    //             for (StoreInfo data : list2) {

    //                 String a = data.getStockTime();
    //                 String b = a.substring(4, 6);
    //                 String c = a.substring(6, 8);

    //                 cal = cal + (Integer.parseInt(b) * 60 + Integer.parseInt(c));

    //             }
    //             double result = cal / list2.size() / 60;

    //             String str = Double.toString(Math.round(result * 100) / 100.0);

    //             String[] hour = str.split("\\."); // .과 같은 예약어를 구분자로 쓸때는 \\를 붙여준다.
    //             double min = 0;
    //             if (hour[0].length() == 1) {
    //                 hour[0] = "0" + hour[0];
    //             }
    //             if (hour[1].length() == 1) {
    //                 hour[1] = hour[1] + "0";
    //             }
    //             min = Double.parseDouble(hour[1]) * 0.6;
    //             min = Math.round(min);
    //             int min2 = (int) min;
    //             String minStr = "";
    //             if (min2 < 10) {
    //                 minStr = "0" + Integer.toString(min2);
    //             } else {
    //                 minStr = Integer.toString(min2);
    //             }
    //             String finalResult = hour[0] + ":" + minStr;

    //             AvgTime avgTime = new AvgTime();

    //             avgTime.setCode(code);
    //             avgTime.setAvgTime(finalResult);
    //             avgTime.setDay(list2.size());

    //             avgTimeRepository.save(avgTime);
    //         }

    //     }
    // }

}
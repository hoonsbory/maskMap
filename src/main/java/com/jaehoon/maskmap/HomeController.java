package com.jaehoon.maskmap;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.google.gson.JsonParser;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
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


    

   
    @RequestMapping(value = "/")
    public String home(HttpServletRequest request) {
                HttpSession session = request.getSession();
                if(session.getAttribute("count")=="count"){   
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
                
                if(ip.contains("192.168.35")||ip.equals("127.0.0.1")||ip.equals("211.49.2.85")){
                    return "index";
                }else{
                    countUser.setUserIP(ip);
                    countUserRepository.save(countUser);
                    
                    session.setAttribute("count", "nocount");
                    
                }

            }
            

        return "index";
    }
   
    @RequestMapping(value = "/address" , method = RequestMethod.POST)
	@ResponseBody
	public String address(@RequestBody String[] address) {
        String url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat="+address[0]+"&lng="+address[1]+"&m=2000";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8"))); // Response Header to
                                                                                                // UTF-8

        // UriComponents builder = UriComponentsBuilder.fromHttpUrl(url).queryParam("_type", "json").build(false); // 자동으로
                                                                                                                // encode해주는
                                                                                                                // 것을 막기
                                                                                                                // 위해
                                                                                                                // false

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        String aa = response.getBody();

       System.out.println(aa);
		return aa;
		
		

    }
//     @RequestMapping(value = "/aa")
//     @ResponseBody
// 	public void elasticSearch() {
//         String url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/sales/json?page=1&perPage=1";
//         RestTemplate restTemplate = new RestTemplate();
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8"))); // Response Header to
//                                                                                                 // UTF-8

//         // UriComponents builder = UriComponentsBuilder.fromHttpUrl(url).queryParam("_type", "json").build(false); // 자동으로
//                                                                                                                 // encode해주는
//                                                                                                                 // 것을 막기
//                                                                                                                 // 위해
//                                                                                                                // false

//         ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

//         String jsonStr = response.getBody();

//        JSONObject jObject = new JSONObject(jsonStr);

//        JSONArray jArray = jObject.getJSONArray("sales");


//        Loop1 : for (int i = 0; i < jArray.length(); i++) {
//         JSONObject obj = jArray.getJSONObject(i);
//         String code = obj.getString("code");
//         String stock_at = obj.getString("stock_at");
//         StoreInfo storeinfo = new StoreInfo();
        
//         // String d = a.substring(0, 4);
//         // String e = a.substring(5, 7);
//         // String f = a.substring(8, 10);
//         // String b = a.substring(11, 13);
//         // String c = a.substring(14, 16);

//         int stock_at2 = Integer.parseInt(stock_at.substring(5,7)+stock_at.substring(8,10)+stock_at.substring(11, 13)+stock_at.substring(14, 16));
//         List<StoreInfo> list = new ArrayList<>();

//         list = storeInfoRepository.findByCode(code);
        
//         for(StoreInfo data : list){
//             if(data.getStockTime()==stock_at2){
//                 continue Loop1;
//             }
//         }

//         if(list.size()==7){
//             Collections.sort(list);
//         }
      


        

//         storeinfo.setCode(code);
//         storeinfo.setStockTime(stock_at2);
//         storeInfoRepository.save(storeinfo);


// 	}
// }
}
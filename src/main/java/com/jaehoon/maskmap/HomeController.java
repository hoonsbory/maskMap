package com.jaehoon.maskmap;

import java.nio.charset.Charset;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


import org.springframework.beans.factory.annotation.Autowired;
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
                
                if(ip.contains("192.168.35")||ip=="127.0.0.1"||ip=="211.49.2.85"){
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

        // String result2 = response.toString();
        // String result3 = response.getBody();
        String aa = response.getBody();

        // String bbb = response.getBody().toString();

        // JsonParser jsonParser = new JsonParser();

        // JsonObject jsonobj = (JsonObject) jsonParser.parse(bbb);

        // JsonArray array = (JsonArray) jsonobj.get("stores");

        // //JsonObject test1 = (JsonObject) array.get(1);

        // //System.out.println("약국이름은 : " + test1.get("name"));

        // //List<String> list = new ArrayList<>();

        // String str = array.toString();

        // // array.forEach(i -> {
        // //     JsonObject result = (JsonObject) i;
            
        // });
		return aa;
		
		

	}
}
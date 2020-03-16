package com.jaehoon.maskmap;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;

import org.apache.catalina.session.StoreBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;



/**
 * HomeController
 */

@Controller
public class HomeController {

  


    @RequestMapping(value = "/")
    public String home() {


        return "index";
    }
   
   
    @RequestMapping(value = "/address" , method = RequestMethod.POST)
	@ResponseBody
	public String address(@RequestBody String[] address) {
        String url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat="+address[0]+"&lng="+address[1]+"&m=1200";
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
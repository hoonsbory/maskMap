package com.jaehoon.maskmap.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * CountUser
 */
@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "storeInfo")
public class StoreInfo implements Comparable<StoreInfo>{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int num;

    @Column
    String code;

    @Column
    String stockTime;


  
   
    // @Override
    // public int compareTo(StoreInfo arg0) {
    //        //내림차순 정렬
    //        String targetStockTime = arg0.getStockTime();
    //        if(stockTime == targetStockTime) return 0;
    //        else if(stockTime < targetStockTime) return -1;
    //        else return 1;
    // }
  @Override
  public int compareTo(StoreInfo o) {
      // 문자열 오름차순 정렬. 숫자로 이루어진 문자열을 오름차순으로 정렬하면 자릿수가 같은 문자열에 한해 숫자가 낮은 순으로 정렬된다. 
      // 1 ,2, 10이 있다면 1, 10 ,2 로 정렬된다. 10은 첫번째 문자가 1이라 2보다 낮기때문이다.
      return stockTime.compareTo(((StoreInfo)o).stockTime);
  }
    
}
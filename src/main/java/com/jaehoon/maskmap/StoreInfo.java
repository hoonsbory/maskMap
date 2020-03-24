package com.jaehoon.maskmap;

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
    int stockTime;

    @Column
    String avgTime;

  
   
    @Override
    public int compareTo(StoreInfo arg0) {
           // TODO Auto-generated method stub
           int targetStockTime = arg0.getStockTime();
           if(stockTime == targetStockTime) return 0;
           else if(stockTime < targetStockTime) return 1;
           else return -1;
    }
  
    
}
package com.jaehoon.maskmap;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * CountUser
 */
@Entity
@Table(name = "countuser")
public class CountUser {

    @Id
    int count;

    @Column
    String userIP;

    public String getUserIP() {
        return userIP;
    }

    public void setUserIP(String userIP) {
        this.userIP = userIP;
    }

   

  
    
}
package com.jaehoon.maskmap.Repository;


import java.util.List;

import com.jaehoon.maskmap.Entity.StoreInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
/**
 * CountUserRepository
 */
@Repository
public interface StoreInfoRepository extends JpaRepository<StoreInfo, String> {

    List<StoreInfo> findByCode(String code);
    
    void deleteByStockTime(String stockTime);
}
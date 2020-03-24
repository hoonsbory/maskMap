package com.jaehoon.maskmap;


import java.util.List;

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
    
}
package com.jaehoon.maskmap.Repository;



import com.jaehoon.maskmap.Entity.CountUser;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
/**
 * CountUserRepository
 */
@Repository
public interface CountUserRepository extends JpaRepository<CountUser, String> {

    
}
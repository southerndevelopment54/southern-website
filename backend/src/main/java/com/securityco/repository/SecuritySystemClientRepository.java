package com.securityco.repository;

import com.securityco.model.SecuritySystemClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecuritySystemClientRepository extends JpaRepository<SecuritySystemClient, Integer> {

    List<SecuritySystemClient> findByIsActiveTrueOrderByDisplayOrderAsc();

    List<SecuritySystemClient> findAllByOrderByDisplayOrderAsc();
}

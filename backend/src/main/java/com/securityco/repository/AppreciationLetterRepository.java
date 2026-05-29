package com.securityco.repository;

import com.securityco.model.AppreciationLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppreciationLetterRepository extends JpaRepository<AppreciationLetter, Integer> {

    List<AppreciationLetter> findByIsActiveTrueOrderByDateDesc();

    List<AppreciationLetter> findAllByOrderByDateDesc();
}

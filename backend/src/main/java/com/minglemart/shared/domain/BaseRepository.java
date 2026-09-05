package com.minglemart.shared.domain;

import java.util.UUID;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;



@NoRepositoryBean
public interface BaseRepository<T extends BaseModel> extends JpaRepository<T, UUID>, JpaSpecificationExecutor<T> {
}

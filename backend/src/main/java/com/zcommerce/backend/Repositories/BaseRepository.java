package com.zcommerce.backend.Repositories;

import java.util.UUID;
import com.zcommerce.backend.Models.BaseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;


@NoRepositoryBean
public interface BaseRepository<T extends BaseModel> extends JpaRepository<T, UUID>, JpaSpecificationExecutor<T> {
}

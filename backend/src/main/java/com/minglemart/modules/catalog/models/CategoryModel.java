package com.minglemart.modules.catalog.models;

import lombok.*;
import java.util.List;
import java.util.ArrayList;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;

import com.minglemart.shared.domain.BaseModel;

@Entity
@Table(name = "categories")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryModel extends BaseModel {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private CategoryModel parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    @OrderBy("position ASC")
    @Builder.Default
    private List<CategoryModel> children = new ArrayList<>();

    @Column(nullable = false, unique = true, length = 160)
    private String slug;

    @Column(nullable = false)
    private String name;

    private String description;

    /** Display order among siblings. */
    @Builder.Default
    @Column(nullable = false)
    private int position = 0;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public boolean isRoot() {
        return parent == null;
    }
}

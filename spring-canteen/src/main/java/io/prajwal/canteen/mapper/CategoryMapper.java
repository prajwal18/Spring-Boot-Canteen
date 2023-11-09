package io.prajwal.canteen.mapper;

import io.prajwal.canteen.dto.CategoryDTO;
import io.prajwal.canteen.dto.dd.CategoryDD;
import io.prajwal.canteen.model.Category;

public class CategoryMapper {

    public static CategoryDTO mapToCategoryDTO(Category category){
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .createdOn(category.getCreatedOn())
                .build();
    }

    public static Category mapToCategory(CategoryDTO categoryDTO){
        return Category.builder()
                .id(categoryDTO.getId())
                .name(categoryDTO.getName())
                .createdOn(categoryDTO.getCreatedOn())
                .build();
    }

    public static CategoryDD mapToCategoryDD(Category category){
        return CategoryDD.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }
}

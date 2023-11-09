package io.prajwal.canteen.service;


import io.prajwal.canteen.dto.CategoryDTO;
import io.prajwal.canteen.dto.CreateCategoryDTO;
import io.prajwal.canteen.dto.dd.CategoryDD;
import io.prajwal.canteen.model.PageinatedResponse;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CategoryService {

    PageinatedResponse<CategoryDTO> findAll(Pageable pageable, String searchTerm);

    CategoryDTO findById(long catId);

    CategoryDTO createCategory(CreateCategoryDTO category);

    Boolean existsById(long catId);

    void updateCategory(CreateCategoryDTO updateCategory, long catId);

    Boolean deleteById(long catId);

    List<CategoryDD> findAllCategoryDD();
}

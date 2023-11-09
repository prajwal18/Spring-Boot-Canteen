package io.prajwal.canteen.service.impl;

import io.prajwal.canteen.dto.CategoryDTO;
import io.prajwal.canteen.dto.CreateCategoryDTO;
import io.prajwal.canteen.dto.dd.CategoryDD;
import io.prajwal.canteen.mapper.CategoryMapper;
import io.prajwal.canteen.model.Category;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.repository.CategoryRepository;
import io.prajwal.canteen.repository.ItemRepository;
import io.prajwal.canteen.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ItemRepository itemRepository;


    public PageinatedResponse<CategoryDTO> findAll(Pageable pageable, String searchTerm) {
        Page<Category> categories = categoryRepository.findAllFilterByName(PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "createdOn"))
        ), searchTerm);

        List<CategoryDTO> categories_only = categories.getContent().stream()
                .map(CategoryMapper::mapToCategoryDTO)
                .toList();

        return new PageinatedResponse<CategoryDTO>(categories_only, categories.getTotalElements());
    }

    @Override
    public CategoryDTO findById(long catId) {
        Category category = categoryRepository.findById(catId).get();
        return CategoryMapper.mapToCategoryDTO(category);
    }

    @Override
    public CategoryDTO createCategory(CreateCategoryDTO category) {
        Category newCategory = Category.builder()
                .name(category.getName())
                .build();
        Category savedCategory = categoryRepository.save(newCategory);
        return CategoryMapper.mapToCategoryDTO(savedCategory);
    }

    @Override
    public Boolean existsById(long catId) {
        return categoryRepository.existsById(catId);
    }

    @Override
    public void updateCategory(CreateCategoryDTO updateCategory, long catId) {
        Category newCategory = Category.builder()
                .name(updateCategory.getName()).build();
        newCategory.setId(catId);
        categoryRepository.save(newCategory);
    }

    @Override
    public Boolean deleteById(long catId) {
        if (itemRepository.findNoOfItemsInCategory(catId) != 0) {
            return false;
        } else {
            categoryRepository.deleteById(catId);
            return true;
        }
    }

    @Override
    public List<CategoryDD> findAllCategoryDD() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(CategoryMapper::mapToCategoryDD)
                .collect(Collectors.toList());
    }

}

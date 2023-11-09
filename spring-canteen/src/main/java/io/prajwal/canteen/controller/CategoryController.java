package io.prajwal.canteen.controller;

import io.prajwal.canteen.dto.CategoryDTO;
import io.prajwal.canteen.dto.CreateCategoryDTO;
import io.prajwal.canteen.dto.dd.CategoryDD;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Get all categories
    @GetMapping
    public ResponseEntity<PageinatedResponse<CategoryDTO>> findAll(Pageable pageable, @RequestParam(value = "searchTerm", required = false) String searchTerm) {
        PageinatedResponse<CategoryDTO> response = categoryService.findAll(pageable, searchTerm);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dd")
    public ResponseEntity<List<CategoryDD>> findAllCategoryDD(){
        List<CategoryDD> categories = categoryService.findAllCategoryDD();
        return ResponseEntity.ok(categories);
    }

    // Get a specific category
    @GetMapping("/{catId}")
    public ResponseEntity<CategoryDTO> findById(@PathVariable long catId) {
        if (categoryService.existsById(catId)) {
            CategoryDTO category = categoryService.findById(catId);
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.notFound().build();
    }

    // Create a category
    @PostMapping
    public ResponseEntity<Void> createCategory(@RequestBody CreateCategoryDTO category, UriComponentsBuilder ucb) {
        CategoryDTO savedCategory = categoryService.createCategory(category);
        URI uri = ucb.path("/categories/{catId}").buildAndExpand(savedCategory.getId()).toUri();
        return ResponseEntity.created(uri).build();
    }

    // Update a category
    @PutMapping("/{catId}")
    public ResponseEntity<Void> updateCategory(@PathVariable long catId, @RequestBody CreateCategoryDTO updateCategory) {
        if (categoryService.existsById(catId)) {
            categoryService.updateCategory(updateCategory, catId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Delete a category
    @DeleteMapping("/{catId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable long catId) {
        if (categoryService.existsById(catId)) {
            if (categoryService.deleteById(catId)) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.badRequest().build(); // If the category contains items in it.
            }
        }
        return ResponseEntity.notFound().build();
    }


}

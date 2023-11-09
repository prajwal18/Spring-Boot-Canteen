package io.prajwal.canteen.repository;

import io.prajwal.canteen.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM categories c WHERE c.name LIKE CONCAT('%', :searchTerm, '%')")
    Page<Category> findAllFilterByName(Pageable pageable, String searchTerm);
}

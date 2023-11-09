package io.prajwal.canteen.repository;

import io.prajwal.canteen.model.Category;
import io.prajwal.canteen.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("SELECT i FROM items i WHERE i.name LIKE CONCAT('%', :searchTerm, '%')")
    Page<Item> findAllFilterByName(PageRequest id, String searchTerm);

    @Query("SELECT i FROM items i WHERE i.name LIKE CONCAT('%', :searchTerm, '%') AND i.category.id = :catId")
    Page<Item> findByCategoryFilterByName(PageRequest id, long catId, String searchTerm);

    @Query("SELECT count(i) FROM items i WHERE i.category.id = :catId")
    int findNoOfItemsInCategory(long catId);

    @Query("SELECT i FROM items i WHERE i.category.id = :catId")
    List<Item> findByCategory(long catId);
}

package io.prajwal.canteen.service;

import io.prajwal.canteen.dto.CreateItemDTO;
import io.prajwal.canteen.dto.ItemDTO;
import io.prajwal.canteen.dto.dd.ItemDD;
import io.prajwal.canteen.model.Item;
import io.prajwal.canteen.model.PageinatedResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ItemService {
    PageinatedResponse<ItemDTO> findAll(Pageable pageable, String searchTerm);

    PageinatedResponse<ItemDTO> findAllByCategory(Pageable pageable, long catId, String searchTerm);

    boolean existsById(long itemId);

    ItemDTO findById(long itemId);
    Item findByIdAnItem(long itemId);

    ItemDTO createItem(long catId, CreateItemDTO item);

    ItemDTO updateItem(long itemId, CreateItemDTO item);

    void deleteById(long itemId);

    List<ItemDD> findAllItemDD(long catId);
}

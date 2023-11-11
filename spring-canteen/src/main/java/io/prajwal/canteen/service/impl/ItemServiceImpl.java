package io.prajwal.canteen.service.impl;

import io.prajwal.canteen.dto.CreateItemDTO;
import io.prajwal.canteen.dto.ItemDTO;
import io.prajwal.canteen.dto.dd.ItemDD;
import io.prajwal.canteen.mapper.ItemMapper;
import io.prajwal.canteen.model.Category;
import io.prajwal.canteen.model.Item;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.repository.CategoryRepository;
import io.prajwal.canteen.repository.ItemRepository;
import io.prajwal.canteen.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public PageinatedResponse<ItemDTO> findAll(Pageable pageable, String searchTerm) {
        Page<Item> items = itemRepository.findAllFilterByName(PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "id"))
        ), searchTerm);

        List<ItemDTO> items_only = items.getContent().stream()
                .map(ItemMapper::mapToItemDTO)
                .toList();
        return new PageinatedResponse<ItemDTO>(items_only, items.getTotalElements());
    }

    @Override
    public PageinatedResponse<ItemDTO> findAllByCategory(Pageable pageable, long catId, String searchTerm) {
        Page<Item> items = itemRepository.findByCategoryFilterByName(PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize() != -1 ? pageable.getPageSize(): Integer.MAX_VALUE,
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "id"))
        ), catId, searchTerm);

        List<ItemDTO> items_only = items.getContent().stream()
                .map(ItemMapper::mapToItemDTO)
                .toList();
        return new PageinatedResponse<ItemDTO>(items_only, items.getTotalElements());
    }

    @Override
    public boolean existsById(long itemId) {
        return itemRepository.existsById(itemId);
    }

    @Override
    public ItemDTO findById(long itemId) {
        Item item = itemRepository.findById(itemId).get();
        return ItemMapper.mapToItemDTO(item);
    }

    @Override
    public Item findByIdAnItem(long itemId) {
        return itemRepository.findById(itemId).get();
    }

    @Override
    public ItemDTO createItem(long catId, CreateItemDTO item) {
        Category category = categoryRepository.findById(catId).get();
        Item newItem = ItemMapper.mapToItemFromCI(item);
        newItem.setCategory(category);

        Item savedItem = itemRepository.save(newItem);
        return ItemMapper.mapToItemDTO(savedItem);
    }

    @Override
    public ItemDTO updateItem(long itemId, CreateItemDTO item) {
        Category category = categoryRepository.findById(item.getCategory()).get();
        Item updatItem = ItemMapper.mapToItemFromCI(item);
        updatItem.setCategory(category);
        updatItem.setId(itemId);
        Item savedItem = itemRepository.save(updatItem);
        return ItemMapper.mapToItemDTO(savedItem);
    }

    @Override
    public void deleteById(long itemId) {
        itemRepository.deleteById(itemId);
    }

    @Override
    public List<ItemDD> findAllItemDD(long catId) {
        List<Item> items = itemRepository.findByCategory(catId);

        return items.stream().map(ItemMapper::mapToItemDD).toList();
    }
}

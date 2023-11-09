package io.prajwal.canteen.controller;

import io.prajwal.canteen.dto.CreateItemDTO;
import io.prajwal.canteen.dto.ItemDTO;
import io.prajwal.canteen.dto.dd.ItemDD;
import io.prajwal.canteen.dto.dd.UserDD;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.service.CategoryService;
import io.prajwal.canteen.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
public class ItemController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ItemService itemService;

    @GetMapping("/items")
    public ResponseEntity<PageinatedResponse<ItemDTO>> findAll(Pageable pageable, @RequestParam(value = "searchTerm", required = false) String searchTerm) {
        PageinatedResponse<ItemDTO> response = itemService.findAll(pageable, searchTerm);
        return ResponseEntity.ok(response);
    }

    @GetMapping("categories/{catId}/items/dd")
    public ResponseEntity<List<ItemDD>> findAllItemDD(@PathVariable long catId){
        List<ItemDD> items = itemService.findAllItemDD(catId); // Returns all items
        return ResponseEntity.ok(items);
    }

    @GetMapping("/categories/{catId}/items")
    public ResponseEntity<PageinatedResponse<ItemDTO>> findAllByCategory(@PathVariable long catId, Pageable pageable, @RequestParam(value = "searchTerm", required = false) String searchTerm) {
        if (categoryService.existsById(catId)) {
            PageinatedResponse<ItemDTO> response = itemService.findAllByCategory(pageable, catId, searchTerm);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/items/{itemId}")
    public ResponseEntity<ItemDTO> findById(@PathVariable long itemId) {
        if (itemService.existsById(itemId)) {
            ItemDTO item = itemService.findById(itemId);
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/categories/{catId}/items")
    public ResponseEntity<Void> createItem(@PathVariable long catId, @RequestBody CreateItemDTO item, UriComponentsBuilder ucb) {
        if (categoryService.existsById(catId)) {
            ItemDTO savedItem = itemService.createItem(catId, item);
            URI uri = ucb.path("/items/{itemId}").buildAndExpand(savedItem.getId()).toUri();
            return ResponseEntity.created(uri).build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<Void> updateItem(@PathVariable long itemId, @RequestBody CreateItemDTO item) {
        if (itemService.existsById(itemId)) {
            ItemDTO savedItem = itemService.updateItem(itemId, item);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteById(@PathVariable long itemId) {
        if (itemService.existsById(itemId)) {
            itemService.deleteById(itemId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}

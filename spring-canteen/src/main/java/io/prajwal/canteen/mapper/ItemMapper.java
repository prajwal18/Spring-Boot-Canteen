package io.prajwal.canteen.mapper;

import io.prajwal.canteen.dto.CreateItemDTO;
import io.prajwal.canteen.dto.ItemDTO;
import io.prajwal.canteen.dto.OrderItemDTO;
import io.prajwal.canteen.dto.dd.ItemDD;
import io.prajwal.canteen.model.Item;

public class ItemMapper {

    public static Item mapToItemFromCI(CreateItemDTO item) {
        return Item.builder()
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .photoURL(item.getPhotoURL())
                .build();
    }

    public static Item mapToItem(ItemDTO item) {
        return Item.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .photoURL(item.getPhotoURL())
                .createdOn(item.getCreatedOn())
                .updatedOn(item.getUpdatedOn())
                .category(CategoryMapper.mapToCategory(item.getCategory()))
                .build();
    }

    public static ItemDTO mapToItemDTO(Item item) {
        return ItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .photoURL(item.getPhotoURL())
                .createdOn(item.getCreatedOn())
                .updatedOn(item.getUpdatedOn())
                .category(CategoryMapper.mapToCategoryDTO(item.getCategory()))
                .build();
    }

    public static OrderItemDTO mapToOrderItemDTO(Item item) {
        return OrderItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .photoURL(item.getPhotoURL())
                .category(CategoryMapper.mapToCategoryDTO(item.getCategory()))
                .build();
    }

    public static Item mapToItemFromOrderItemDTO(OrderItemDTO item) {
        return Item.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .photoURL(item.getPhotoURL())
                .category(CategoryMapper.mapToCategory(item.getCategory()))
                .build();
    }

    public static ItemDD mapToItemDD(Item item) {
        return ItemDD.builder()
                .id(item.getId())
                .name(item.getName())
                .catId(item.getCategory().getId())
                .photoURL(item.getPhotoURL())
                .price(item.getPrice())
                .build();
    }
}

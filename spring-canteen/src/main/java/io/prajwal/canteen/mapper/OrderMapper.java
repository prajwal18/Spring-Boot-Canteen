package io.prajwal.canteen.mapper;

import io.prajwal.canteen.dto.OrderDTO;
import io.prajwal.canteen.model.Order;

import java.util.stream.Collectors;

public class OrderMapper {
    public static Order mapToOrder(OrderDTO order) {
        return Order.builder()
                .id(order.getId())
                .createdOn(order.getCreatedOn())
                .owner(UserMapper.mapToUserEntity(order.getOwner()))
                .items(
                        order.getItems().stream()
                                .map(ItemMapper::mapToItemFromOrderItemDTO)
                                .collect(Collectors.toList())
                )
                .build();
    }

    public static OrderDTO mapToOrderDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .createdOn(order.getCreatedOn())
                .owner(UserMapper.mapToUserDTO(order.getOwner()))
                .items(
                        order.getItems().stream()
                                .map(ItemMapper::mapToOrderItemDTO)
                                .collect(Collectors.toList())
                )
                .build();
    }
}

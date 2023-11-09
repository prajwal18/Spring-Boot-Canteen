package io.prajwal.canteen.service;

import io.prajwal.canteen.dto.CreateOrderDTO;
import io.prajwal.canteen.dto.OrderDTO;
import io.prajwal.canteen.model.Item;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.model.UserEntity;
import org.springframework.data.domain.Pageable;

import java.text.ParseException;
import java.util.List;

public interface OrderService {
    PageinatedResponse<OrderDTO> findAll(Pageable pageable, String timerange, String searchTerm);

    boolean existsById(long orderId);

    OrderDTO findById(long orderId);

    OrderDTO createOrder(CreateOrderDTO order);

    OrderDTO updateOrder(CreateOrderDTO order, long orderId);

    void deleteById(long orderId);

    boolean existsByIdAndOwner(long orderId, UserEntity owner);

    PageinatedResponse<OrderDTO> findAllByOwner(UserEntity owner, Pageable pageable, String timerange) throws ParseException;

}

package io.prajwal.canteen.service.impl;

import io.prajwal.canteen.dto.CreateOrderDTO;
import io.prajwal.canteen.dto.OrderDTO;
import io.prajwal.canteen.mapper.OrderMapper;
import io.prajwal.canteen.model.Item;
import io.prajwal.canteen.model.Order;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.model.UserEntity;
import io.prajwal.canteen.repository.ItemRepository;
import io.prajwal.canteen.repository.OrderRepository;
import io.prajwal.canteen.repository.UserRepository;
import io.prajwal.canteen.service.OrderService;
import io.prajwal.canteen.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public PageinatedResponse<OrderDTO> findAll(Pageable pageable, String timerange, String searchTerm) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        if (timerange != null) {
            String[] date = timerange.split("to");
            // Appending time information into date string
            date[0] = date[0] + "T00:00:00";
            date[1] = date[1] + "T00:00:00";
            LocalDateTime startDate = LocalDateTime.parse(date[0], formatter);
            LocalDateTime endDate = LocalDateTime.parse(date[1], formatter);
            return withTimeRangeFindAll(pageable, startDate, endDate, searchTerm);
        } else {
            return noTimeRangeFindAll(pageable, searchTerm);
        }
    }

    private PageinatedResponse<OrderDTO> noTimeRangeFindAll(Pageable pageable, String searchTerm) {
        Page<Order> orders = orderRepository.findAllFilterByOwnerUsername(PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "createdOn"))
        ), searchTerm);
        List<OrderDTO> ordersOnly = orders.getContent().stream().map(OrderMapper::mapToOrderDTO)
                .toList();
        return new PageinatedResponse<>(ordersOnly, orders.getTotalElements());
    }

    private PageinatedResponse<OrderDTO> withTimeRangeFindAll(Pageable pageable, LocalDateTime startDate, LocalDateTime endDate, String searchTerm) {
        Page<Order> orders = orderRepository.findAllFilterByTimeRangeAndOwnerUsername(PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "createdOn"))
        ), startDate, endDate, searchTerm);
        List<OrderDTO> ordersOnly = orders.getContent().stream().map(OrderMapper::mapToOrderDTO)
                .toList();
        return new PageinatedResponse<>(ordersOnly, orders.getTotalElements());
    }



    @Override
    public boolean existsById(long orderId) {
        return orderRepository.existsById(orderId);
    }

    @Override
    public OrderDTO findById(long orderId) {
        Order order = orderRepository.findById(orderId).get();
        return OrderMapper.mapToOrderDTO(order);
    }

    @Override
    public OrderDTO createOrder(CreateOrderDTO order) {
        try {
            UserEntity owner = userRepository.findById(order.getOwner()).orElseGet(() -> null);
            if (owner != null) {
                List<Item> items = new ArrayList<>();
                order.getItems()
                        .forEach(item_id -> {
                            itemRepository.findById(item_id).ifPresent(items::add);
                        });

                Order newOrder = Order.builder()
                        .owner(owner)
                        .items(items)
                        .build();

                Order savedOrder = orderRepository.save(newOrder);
                return OrderMapper.mapToOrderDTO(savedOrder);
            } else {
                return null;
            }
        } catch (Exception ex) {
            return null;
        }
    }

    @Override
    public OrderDTO updateOrder(CreateOrderDTO order, long orderId) {
        UserEntity owner = userRepository.findById(order.getOwner()).orElseGet(() -> null);
        if (owner != null) {
            List<Item> items = new ArrayList<>();

            order.getItems()
                    .forEach(item_id -> {
                        itemRepository.findById(item_id).ifPresent(items::add);
                    });

            Order newOrder = Order.builder()
                    .id(orderId)
                    .owner(owner)
                    .items(items)
                    .build();

            Order savedOrder = orderRepository.save(newOrder);
            return OrderMapper.mapToOrderDTO(savedOrder);
        }
        return null;
    }

    @Override
    public void deleteById(long orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public boolean existsByIdAndOwner(long orderId, UserEntity owner) {
        return orderRepository.existsByIdAndOwner(orderId, owner);
    }

    @Override
    public PageinatedResponse<OrderDTO> findAllByOwner(UserEntity owner, Pageable pageable, String timerange) throws ParseException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        if (timerange != null) {
            String[] date = timerange.split("to");
            // Appending time information into date string
            date[0] = date[0] + "T00:00:00";
            date[1] = date[1] + "T00:00:00";
            LocalDateTime startDate = LocalDateTime.parse(date[0], formatter);
            LocalDateTime endDate = LocalDateTime.parse(date[1], formatter);
            return withTimeRangeFindAllByOwner(owner, pageable, startDate, endDate);
        } else {
            return noTimeRangeFindAllByOwner(owner, pageable);
        }
    }

    private PageinatedResponse<OrderDTO>noTimeRangeFindAllByOwner(UserEntity owner, Pageable pageable) {
        Page<Order> orders = orderRepository.findAllByOwner(owner, PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "createdOn"))
        ));
        List<OrderDTO> ordersOnly = orders.getContent().stream().map(OrderMapper::mapToOrderDTO)
                .toList();
        return new PageinatedResponse<>(ordersOnly, orders.getTotalElements());
    }

    private PageinatedResponse<OrderDTO> withTimeRangeFindAllByOwner(UserEntity owner, Pageable pageable, LocalDateTime startDate, LocalDateTime endDate) {
        Page<Order> orders = orderRepository.findAllByOwnerFilterByTimeRange(owner, startDate, endDate, PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "createdOn"))
        ));
        List<OrderDTO> ordersOnly = orders.getContent().stream().map(OrderMapper::mapToOrderDTO)
                .toList();
        return new PageinatedResponse<>(ordersOnly, orders.getTotalElements());
    }
}
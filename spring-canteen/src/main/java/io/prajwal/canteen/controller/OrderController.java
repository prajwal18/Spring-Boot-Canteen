package io.prajwal.canteen.controller;

import io.prajwal.canteen.dto.CreateOrderDTO;
import io.prajwal.canteen.dto.OrderDTO;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.model.UserEntity;
import io.prajwal.canteen.service.ItemService;
import io.prajwal.canteen.service.OrderService;
import io.prajwal.canteen.service.UserService;
import io.prajwal.canteen.util.JwtUtil;
import io.prajwal.canteen.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.text.ParseException;
import java.util.List;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private ItemService itemService;


    @GetMapping("/orders")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<PageinatedResponse<OrderDTO>> findAll(Pageable pageable, @RequestParam(value = "timerange", required = false) String timerange, @RequestParam(value = "searchTerm", required = false) String searchTerm ) {
        PageinatedResponse<OrderDTO> response = orderService.findAll(pageable, timerange, searchTerm);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDTO> findById(@PathVariable long orderId, @RequestHeader("Authorization") String token) {
        if (SecurityUtil.hasRole("ADMIN") && orderService.existsById(orderId)) {
            OrderDTO order = orderService.findById(orderId);
            return ResponseEntity.ok(order);
        } else {
            String jwtToken = token.substring(7);
            String username = jwtUtil.extractUsername(jwtToken);
            UserEntity owner = userService.findByUsername(username);
            if (orderService.existsByIdAndOwner(orderId, owner)) {
                OrderDTO order = orderService.findById(orderId);
                return ResponseEntity.ok(order);
            }
        }
        return ResponseEntity.notFound().build();
    }


    // Time range is a string containing a range of date sperated by a to i.e. 11-12-2022to11-12-2023
    @GetMapping("/users/{userId}/orders")
    public ResponseEntity<PageinatedResponse<OrderDTO>> findOrdersOfUsers(@PathVariable long userId, @RequestHeader("Authorization") String token, Pageable pageable, @RequestParam(value = "timerange", required = false) String timerange) throws ParseException {
        // Check if the userId is of the principal or a staff
        String jwtToken = token.substring(7);
        String username = jwtUtil.extractUsername(jwtToken);
        UserEntity owner = userService.findByUsername(username);
        if ((owner.getId() == userId) || SecurityUtil.hasRole("STAFF")) {
            PageinatedResponse<OrderDTO> response = orderService.findAllByOwner(owner, pageable, timerange);
            return ResponseEntity.ok(response);
        }
        // if not return a 401 unauthorized.
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @PostMapping("/orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> createOrder(@RequestBody CreateOrderDTO order, UriComponentsBuilder ucb) {
        OrderDTO savedOrder = orderService.createOrder(order);
        if (savedOrder != null) {
            URI uri = ucb.path("/orders/{orderId}").buildAndExpand(savedOrder.getId()).toUri();
            return ResponseEntity.created(uri).build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/orders/{orderId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> updateOrder(@PathVariable long orderId, @RequestBody CreateOrderDTO order) {
        if (orderService.existsById(orderId)) {
            orderService.updateOrder(order, orderId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/orders/{orderId}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> deleteById(@PathVariable long orderId) {
        if (orderService.existsById(orderId)) {
            orderService.deleteById(orderId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


}

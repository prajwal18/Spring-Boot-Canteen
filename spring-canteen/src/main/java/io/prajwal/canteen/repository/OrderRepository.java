package io.prajwal.canteen.repository;

import io.prajwal.canteen.model.Order;
import io.prajwal.canteen.model.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByIdAndOwner(long orderId, UserEntity owner);

    Page<Order> findAllByOwner(UserEntity owner, Pageable pageable);

    @Query("SELECT o FROM orders o where o.owner = :owner and o.createdOn >= :startDate and o.createdOn <= :endDate")
    Page<Order> findAllByOwnerFilterByTimeRange(UserEntity owner, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT o FROM orders o where o.owner.username LIKE CONCAT('%', :searchTerm, '%')")
    Page<Order> findAllFilterByOwnerUsername(Pageable pageable, String searchTerm);

    @Query("SELECT o FROM orders o where o.owner.username LIKE CONCAT('%', :searchTerm, '%') and o.createdOn >= :startDate and o.createdOn <= :endDate")
    Page<Order> findAllFilterByTimeRangeAndOwnerUsername(Pageable pageable, LocalDateTime startDate, LocalDateTime endDate, String searchTerm);
}

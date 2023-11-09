package io.prajwal.canteen.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdOn;

    // Connecting to other entities
    // -- USER
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="owner_id", nullable = false)
    private UserEntity owner;

    // -- ITEM
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "order_line",
            joinColumns = { @JoinColumn(name="order_id", referencedColumnName = "id") },
            inverseJoinColumns = { @JoinColumn(name="item_id", referencedColumnName = "id") }
    )
    List<Item> items = new ArrayList<>();

}

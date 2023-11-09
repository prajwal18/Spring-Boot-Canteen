package io.prajwal.canteen.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String photoURL;

    private String description;

    private Double price;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdOn;
    @UpdateTimestamp
    private LocalDateTime updatedOn;

    // Connecting to other entities
    // -- CATEGORY
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="category_id", nullable = false)
    private Category category;

    // -- ORDER
    @JsonIgnore
    @ManyToMany(mappedBy = "items")
    private List<Order> orders = new ArrayList<>();
}

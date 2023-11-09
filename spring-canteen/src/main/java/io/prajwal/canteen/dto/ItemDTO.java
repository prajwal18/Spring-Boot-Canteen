package io.prajwal.canteen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemDTO {
    private Long id;
    private String name;
    private String photoURL;
    private String description;
    private Double price;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    private CategoryDTO category;
}

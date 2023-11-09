package io.prajwal.canteen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateItemDTO {
    private String name;
    private String photoURL;
    private String description;
    private Double price;
    private Long category = 0L; // This property will only be used for updating the category of an item. While creating an
                                // item, it's category will be specified in its request url i.e (POST).../categories/1/items
}
package io.prajwal.canteen.dto.dd;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemDD {
    private Long id;
    private String name;
    private Long catId;
    private Double price;
    private String photoURL;
}

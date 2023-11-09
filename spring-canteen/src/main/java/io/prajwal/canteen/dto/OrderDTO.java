package io.prajwal.canteen.dto;

import io.prajwal.canteen.model.Item;
import io.prajwal.canteen.model.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private LocalDateTime createdOn;
    private UserDTO owner;
    List<OrderItemDTO> items = new ArrayList<>();
}

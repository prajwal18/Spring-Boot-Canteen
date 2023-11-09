package io.prajwal.canteen.dto.dd;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDD {
    private Long id;
    private String username;
    private String email;
}

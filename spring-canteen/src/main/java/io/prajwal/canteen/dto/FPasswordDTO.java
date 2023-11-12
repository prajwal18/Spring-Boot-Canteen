package io.prajwal.canteen.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FPasswordDTO {
    private String newPassword;
    private String email;
    private String otp;
}

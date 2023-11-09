package io.prajwal.canteen.dto;

import io.prajwal.canteen.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class

CreateUserDTO {
    private String username;
    private String password;
    private String email;
    private List<String> roles;
}
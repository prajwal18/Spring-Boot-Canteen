package io.prajwal.canteen.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
public class AuthRes {
    private final String jwt;
    private final String username;
    private final Long id;
    private List<String> roles;
}

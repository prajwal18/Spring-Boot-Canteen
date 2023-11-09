package io.prajwal.canteen.service;

import io.prajwal.canteen.dto.CreateUserDTO;
import io.prajwal.canteen.dto.PasswordDTO;
import io.prajwal.canteen.dto.UserDTO;
import io.prajwal.canteen.dto.dd.UserDD;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.model.UserEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {

    PageinatedResponse<UserDTO> findAll(Pageable pageable, String searchTerm, String role);

    boolean existsById(long userId);

    UserDTO findById(long userId);

    UserDTO createUser(CreateUserDTO user);

    void updateUser(CreateUserDTO user, long userId);

    boolean deleteById(long userId) throws Exception;

    UserEntity findByUsername(String username);

    void changePassword(long userId, PasswordDTO passwordDTO) throws Exception;

    void changePasswordByAdmin(long userId, PasswordDTO passwordDTO);

    List<UserDD> findAllUserDD(String searchTerm);
}

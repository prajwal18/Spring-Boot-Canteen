package io.prajwal.canteen.repository;

import io.prajwal.canteen.model.Role;
import io.prajwal.canteen.model.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findFirstByUsername(String username);

    UserEntity findFirstByEmail(String email);

    @Query("SELECT u FROM users u WHERE u.username LIKE CONCAT('%', :searchTerm, '%') AND :role MEMBER OF u.roles")
    Page<UserEntity> findAllFilterByRoleAndUsername(Pageable pageable, String searchTerm, Role role);

//    @Query("SELECT u FROM users u WHERE u.username LIKE CONCAT('%', :searchTerm, '%')")
    @Query("SELECT u FROM users u WHERE u.username LIKE CONCAT('%', :searchTerm, '%')")
    Page<UserEntity> findAllFilterByUsername(Pageable pageable, String searchTerm);


}

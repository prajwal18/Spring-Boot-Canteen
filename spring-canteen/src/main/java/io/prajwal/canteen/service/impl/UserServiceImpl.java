package io.prajwal.canteen.service.impl;

import io.prajwal.canteen.UserType;
import io.prajwal.canteen.dto.CreateUserDTO;
import io.prajwal.canteen.dto.PasswordDTO;
import io.prajwal.canteen.dto.UserDTO;
import io.prajwal.canteen.dto.dd.UserDD;
import io.prajwal.canteen.mapper.UserMapper;
import io.prajwal.canteen.model.PageinatedResponse;
import io.prajwal.canteen.model.Role;
import io.prajwal.canteen.model.UserEntity;
import io.prajwal.canteen.repository.RoleRepository;
import io.prajwal.canteen.repository.UserRepository;
import io.prajwal.canteen.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    // Helper Method -----
    private List<Role> getRolesForUserType(UserType userType) {
        List<Role> roles = new ArrayList<>();
        Role customer = roleRepository.findByName("CUSTOMER");
        roles.add(customer);
        if (userType.equals(UserType.ADMIN)) {
            Role admin = roleRepository.findByName("ADMIN");
            roles.add(admin);
        } else if (userType.equals(UserType.STAFF)) {
            Role staff = roleRepository.findByName("STAFF");
            roles.add(staff);
        }
        return roles;
    }

    private List<Role> getRolesByUserId(long userId) {
        return userRepository.findById(userId).get().getRoles();
    }

    private List<Role> getRolesFromRoleNames(List<String> roles) {
        List<Role> finalRoles = new ArrayList<>();
        roles
                .forEach(role -> {
                    Role role_r = roleRepository.findByName(role);
                    if (role_r != null) {
                        finalRoles.add(role_r);
                    }
                });
        return finalRoles;
    }

    private String getPasswordFromUserId(long userId) {
        return userRepository.findById(userId).get().getPassword();
    }
    // Helper Method -----


    @Override
    public PageinatedResponse<UserDTO> findAll(Pageable pageable, String searchTerm, String role) {
        if (Objects.equals(role, "") || Objects.equals(role, "ALL")) {
            return findAllFilterByUsername(pageable, searchTerm);
        } else {
            return findAllFilterByUsernameAndRole(pageable, searchTerm, role);
        }
    }

    private PageinatedResponse<UserDTO> findAllFilterByUsername(Pageable pageable, String searchTerm) {
        Page<UserEntity> users = userRepository.findAllFilterByUsername(PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "createdOn"))
        ), searchTerm);

        List<UserDTO> users_only = users.getContent().stream()
                .map(UserMapper::mapToUserDTO)
                .toList();
        return new PageinatedResponse<UserDTO>(users_only, users.getTotalElements());
    }

    private PageinatedResponse<UserDTO> findAllFilterByUsernameAndRole(Pageable pageable, String searchTerm, String role) {
        Role role_obj = roleRepository.findByName(role);
        Page<UserEntity> users = userRepository.findAllFilterByRoleAndUsername(PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getSortOr(Sort.by(Sort.Direction.ASC, "createdOn"))
        ), searchTerm, role_obj);

        List<UserDTO> users_only = users.getContent().stream()
                .map(UserMapper::mapToUserDTO)
                .toList();
        return new PageinatedResponse<UserDTO>(users_only, users.getTotalElements());
    }


    @Override
    public boolean existsById(long userId) {
        return userRepository.existsById(userId);
    }

    @Override
    public UserDTO findById(long userId) {
        UserEntity user = userRepository.findById(userId).get();
        return UserMapper.mapToUserDTO(user);
    }

    @Override
    public UserDTO createUser(CreateUserDTO user) {
        UserEntity newUser = UserMapper.mapToUserEntityFromCU(user);
        List<Role> roles = getRolesFromRoleNames(user.getRoles());
        newUser.setRoles(roles);

        newUser.setPassword(encoder.encode(user.getPassword()));
        UserEntity createdUser = userRepository.save(newUser);

        return UserMapper.mapToUserDTO(createdUser);
    }

    @Override
    public void updateUser(CreateUserDTO user, long userId) {
        UserEntity updateUser = UserMapper.mapToUserEntityFromCUForUpdate(user);
        updateUser.setId(userId);
        // Get the user's password
        String password = getPasswordFromUserId(userId);
        updateUser.setPassword(password);

        List<Role> roles = getRolesByUserId(userId);
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            roles = getRolesFromRoleNames(user.getRoles());
        }

        updateUser.setRoles(roles);

        userRepository.save(updateUser);
    }

    @Override
    public boolean deleteById(long userId) throws Exception {
        if (checkIfUserIsAAdmin(userId)) {
            return false;
        }
        userRepository.deleteById(userId);
        return true;
    }

    private boolean checkIfUserIsAAdmin(long userId) {
        UserEntity user = userRepository.findById(userId).get();
        List<Role> roles = user.getRoles();
        for (Role role : roles) {
            if (role.getName().equals("ADMIN")) {
                return true;
            }
        }
        return false;
    }

    @Override
    public UserEntity findByUsername(String username) {
        return userRepository.findFirstByUsername(username);
    }

    @Override
    public void changePassword(long userId, PasswordDTO passwordDTO) throws Exception {
        UserEntity user = userRepository.findById(userId).orElseGet(() -> null);
        if (user != null) {
            String rawPassword = passwordDTO.getOldPassword();
            String encodedPassword = user.getPassword();
            if (encoder.matches(rawPassword, encodedPassword)) {
                String newEncodedPassword = encoder.encode(passwordDTO.getNewPassword());
                user.setPassword(newEncodedPassword);
                userRepository.save(user);
            } else {
                throw new Exception("Old Password doesn't match.");
            }
        } else {
            throw new UsernameNotFoundException("User not found.");
        }
    }

    @Override
    public void changePasswordByAdmin(long userId, PasswordDTO passwordDTO) {
        UserEntity user = userRepository.findById(userId).get();
        String newRawPassword = passwordDTO.getNewPassword();
        String newEncodedPassword = encoder.encode(newRawPassword);

        // Updating the user with the encoded password
        user.setPassword(newEncodedPassword);
        userRepository.save(user);
    }

    @Override
    public List<UserDD> findAllUserDD(String searchTerm) {
        Page<UserEntity> users = userRepository.findAllFilterByUsername(
                PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "createdOn")),
                searchTerm
        );
        return users.getContent().stream().map(UserMapper::mapToUserDD).toList();
    }


}

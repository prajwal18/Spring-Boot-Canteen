package io.prajwal.canteen.mapper;

import io.prajwal.canteen.dto.CreateUserDTO;
import io.prajwal.canteen.dto.UserDTO;
import io.prajwal.canteen.dto.dd.UserDD;
import io.prajwal.canteen.model.UserEntity;

public class UserMapper {

    public static UserEntity mapToUserEntity(UserDTO user){
        return UserEntity.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .createdOn(user.getCreatedOn())
                .updatedOn(user.getUpdatedOn())
                .build();
    }

    public static UserDTO mapToUserDTO(UserEntity user){
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .createdOn(user.getCreatedOn())
                .updatedOn(user.getUpdatedOn())
                .build();
    }

    public static UserEntity mapToUserEntityFromCU(CreateUserDTO user) {
        return UserEntity.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .email(user.getEmail())
                .build();
    }

    public static UserEntity mapToUserEntityFromCUForUpdate(CreateUserDTO user) {
        return UserEntity.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public static UserDD mapToUserDD(UserEntity user){
        return UserDD.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}

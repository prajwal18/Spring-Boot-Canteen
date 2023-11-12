package io.prajwal.canteen.repository;

import io.prajwal.canteen.model.OTP;
import io.prajwal.canteen.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OTPReository extends JpaRepository<OTP, Long> {

    @Query("SELECT o FROM otps o WHERE o.user.email = :email")
    OTP findByUserEmail(String email);
}

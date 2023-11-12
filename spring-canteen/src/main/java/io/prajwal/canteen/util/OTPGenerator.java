package io.prajwal.canteen.util;

import java.util.Random;

public class OTPGenerator {
    private static final Integer LENGTH = 6;
    private static final Long expirationDuration = 5L * 60 * 1000 ; // 5 minutes

    public static String generateOTP() {
        StringBuilder otp = new StringBuilder();
        Random rand = new Random();
        for(int i=0; i< LENGTH; i++){
            int digit = rand.nextInt(10);
            otp.append(digit);
        }
        return otp.toString().trim();
    }

}

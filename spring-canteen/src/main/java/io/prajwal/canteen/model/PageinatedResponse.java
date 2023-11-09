package io.prajwal.canteen.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageinatedResponse<T> {
    List<T> items = new ArrayList<>();
    Number total = 0;
}

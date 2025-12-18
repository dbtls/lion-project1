package org.example.todolist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TodoCreateRequest {
    @NotBlank
    @Size(max = 100)
    String title;
    @NotBlank
    LocalDateTime todoAt;

    @Size(max = 1000) String detail;

}

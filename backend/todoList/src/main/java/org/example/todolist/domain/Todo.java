package org.example.todolist.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false)
    private boolean done;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime todoAt;

    @Column(columnDefinition = "TEXT")
    private String detail;

    public void toggleDone() {
        this.done = !this.done;
    }

    public Todo(String title, LocalDateTime todoAt, String detail) {
        this.title = title;
        this.todoAt = todoAt;
        this.detail = (detail == null || detail.isBlank()) ? null : detail;
        this.done = false;
    }

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}

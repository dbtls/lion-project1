package org.example.todolist.controller;


import org.example.todolist.domain.Todo;
import org.example.todolist.dto.TodoCreateRequest;
import org.example.todolist.repository.TodoRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    private final TodoRepository repo;

    public TodoController(TodoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Todo> findAll() {
        return repo.findAllByOrderByTodoAtDesc();
    }

    @PostMapping
    public Todo create(@RequestBody TodoCreateRequest req) {
        Todo todo = new Todo(req.getTitle(), req.getTodoAt(), req.getDetail());
        return repo.save(todo);
    }

    @PatchMapping("/{id}/toggle")
    public Todo toggle(@PathVariable Long id) {
        Todo todo = repo.findById(id).orElseThrow();
        todo.toggleDone();
        return repo.save(todo);
    }

    @DeleteMapping("/done")
    public void deleteDone() {
        List<Todo> todo = repo.findByDoneIsTrue();
        repo.deleteAll(todo);
    }
}
---
id: polyglot-patterns
title: Polyglot Patterns — The Same Idea in Every Language
category: Programming
date: March 9, 2026
tags: TypeScript, Python, Rust, Go, C++, Java, Programming
---

Every language has its own way of expressing the same fundamental ideas. Here's a quick tour of common patterns written in seven languages — a handy reference and a reminder that good code is good code, regardless of syntax.

## Typed Data Structures

Defining a shape for your data is the first thing you do in any serious project.

### TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

function greet(user: User): string {
  const { name, roles } = user;
  return `Hello ${name}, you have ${roles.length} roles`;
}

const admin: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  roles: ["admin", "editor"],
};

console.log(greet(admin));
```

### Python

```python
from dataclasses import dataclass, field

@dataclass
class User:
    id: int
    name: str
    email: str
    roles: list[str] = field(default_factory=list)

    def greet(self) -> str:
        return f"Hello {self.name}, you have {len(self.roles)} roles"

admin = User(
    id=1,
    name="Alice",
    email="alice@example.com",
    roles=["admin", "editor"],
)

print(admin.greet())
```

### Rust

```rust
#[derive(Debug, Clone)]
struct User {
    id: u64,
    name: String,
    email: String,
    roles: Vec<String>,
}

impl User {
    fn greet(&self) -> String {
        format!("Hello {}, you have {} roles", self.name, self.roles.len())
    }
}

fn main() {
    let admin = User {
        id: 1,
        name: "Alice".into(),
        email: "alice@example.com".into(),
        roles: vec!["admin".into(), "editor".into()],
    };

    println!("{}", admin.greet());
}
```

### Go

```go
package main

import "fmt"

type User struct {
    ID    int
    Name  string
    Email string
    Roles []string
}

func (u *User) Greet() string {
    return fmt.Sprintf("Hello %s, you have %d roles", u.Name, len(u.Roles))
}

func main() {
    admin := &User{
        ID:    1,
        Name:  "Alice",
        Email: "alice@example.com",
        Roles: []string{"admin", "editor"},
    }

    fmt.Println(admin.Greet())
}
```

### Java

```java
import java.util.List;

public record User(int id, String name, String email, List<String> roles) {
    public String greet() {
        return "Hello %s, you have %d roles".formatted(name, roles.size());
    }

    public static void main(String[] args) {
        var admin = new User(1, "Alice", "alice@example.com", List.of("admin", "editor"));
        System.out.println(admin.greet());
    }
}
```

### C++

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <format>

struct User {
    int id;
    std::string name;
    std::string email;
    std::vector<std::string> roles;

    std::string greet() const {
        return std::format("Hello {}, you have {} roles", name, roles.size());
    }
};

int main() {
    User admin{
        .id = 1,
        .name = "Alice",
        .email = "alice@example.com",
        .roles = {"admin", "editor"},
    };

    std::cout << admin.greet() << std::endl;
    return 0;
}
```

## Error Handling

How each language deals with the unhappy path.

### TypeScript

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchUser(id: number): Promise<Result<User>> {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) {
      return { ok: false, error: new Error(`HTTP ${res.status}`) };
    }
    const user: User = await res.json();
    return { ok: true, value: user };
  } catch (err) {
    return { ok: false, error: err as Error };
  }
}

const result = await fetchUser(1);
if (result.ok) {
  console.log(result.value.name);
} else {
  console.error("Failed:", result.error.message);
}
```

### Rust

```rust
use std::fs;
use std::io;

fn read_config(path: &str) -> Result<String, io::Error> {
    let content = fs::read_to_string(path)?;
    let trimmed = content.trim().to_string();

    if trimmed.is_empty() {
        return Err(io::Error::new(io::ErrorKind::InvalidData, "empty config"));
    }

    Ok(trimmed)
}

fn main() {
    match read_config("config.toml") {
        Ok(config) => println!("Loaded: {config}"),
        Err(e) => eprintln!("Error: {e}"),
    }
}
```

### Go

```go
func readConfig(path string) (string, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return "", fmt.Errorf("reading config: %w", err)
    }

    content := strings.TrimSpace(string(data))
    if content == "" {
        return "", errors.New("empty config")
    }

    return content, nil
}

func main() {
    config, err := readConfig("config.toml")
    if err != nil {
        log.Fatalf("Error: %v", err)
    }
    fmt.Println("Loaded:", config)
}
```

### Python

```python
from pathlib import Path

def read_config(path: str) -> str:
    content = Path(path).read_text().strip()
    if not content:
        raise ValueError("empty config")
    return content

try:
    config = read_config("config.toml")
    print(f"Loaded: {config}")
except (FileNotFoundError, ValueError) as e:
    print(f"Error: {e}")
```

## Iterators & Functional Pipelines

Transforming collections without mutation.

### TypeScript

```typescript
const users: User[] = [
  { id: 1, name: "Alice", email: "a@b.com", roles: ["admin"] },
  { id: 2, name: "Bob", email: "b@b.com", roles: [] },
  { id: 3, name: "Charlie", email: "c@b.com", roles: ["editor"] },
];

const activeAdmins = users
  .filter((u) => u.roles.length > 0)
  .filter((u) => u.roles.includes("admin"))
  .map((u) => u.name.toUpperCase());

console.log(activeAdmins); // ["ALICE"]
```

### Rust

```rust
let users = vec![
    User { id: 1, name: "Alice".into(), roles: vec!["admin".into()] },
    User { id: 2, name: "Bob".into(), roles: vec![] },
    User { id: 3, name: "Charlie".into(), roles: vec!["editor".into()] },
];

let active_admins: Vec<String> = users
    .iter()
    .filter(|u| !u.roles.is_empty())
    .filter(|u| u.roles.contains(&"admin".to_string()))
    .map(|u| u.name.to_uppercase())
    .collect();

println!("{:?}", active_admins); // ["ALICE"]
```

### Python

```python
users = [
    User(1, "Alice", "a@b.com", ["admin"]),
    User(2, "Bob", "b@b.com", []),
    User(3, "Charlie", "c@b.com", ["editor"]),
]

active_admins = [
    u.name.upper()
    for u in users
    if u.roles and "admin" in u.roles
]

print(active_admins)  # ['ALICE']
```

### Go

```go
var activeAdmins []string
for _, u := range users {
    if len(u.Roles) == 0 {
        continue
    }
    for _, role := range u.Roles {
        if role == "admin" {
            activeAdmins = append(activeAdmins, strings.ToUpper(u.Name))
            break
        }
    }
}

fmt.Println(activeAdmins) // [ALICE]
```

## Concurrency

Doing multiple things at once — the part where languages diverge the most.

### TypeScript

```typescript
async function fetchAll(ids: number[]): Promise<User[]> {
  const promises = ids.map((id) =>
    fetch(`/api/users/${id}`).then((r) => r.json())
  );
  return Promise.all(promises);
}

const users = await fetchAll([1, 2, 3]);
console.log(`Fetched ${users.length} users`);
```

### Go

```go
func fetchAll(ids []int) ([]User, error) {
    var wg sync.WaitGroup
    results := make([]User, len(ids))
    errs := make([]error, len(ids))

    for i, id := range ids {
        wg.Add(1)
        go func(i, id int) {
            defer wg.Done()
            results[i], errs[i] = fetchUser(id)
        }(i, id)
    }

    wg.Wait()
    return results, errors.Join(errs...)
}
```

### Rust

```rust
use tokio;

async fn fetch_all(ids: &[u64]) -> Vec<Result<User, reqwest::Error>> {
    let handles: Vec<_> = ids
        .iter()
        .map(|&id| tokio::spawn(fetch_user(id)))
        .collect();

    let mut results = Vec::new();
    for handle in handles {
        results.push(handle.await.unwrap());
    }
    results
}
```

Good code is readable, handles errors gracefully, and communicates intent clearly — no matter the language. Pick the right tool for the job, but know the patterns are universal.

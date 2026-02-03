---
id: rl-basics
title: Reinforcement Learning
category: Deep Learning
date: February 1, 2025
---

Reinforcement Learning (RL) is a type of machine learning where an agent learns to make decisions by interacting with an environment to maximize cumulative reward.

## Q-Learning

Q-learning is a model-free reinforcement learning algorithm that learns the value of actions in states without requiring a model of the environment.

```python
# filename: q_learning.py
import numpy as np

class QLearningAgent:
    def __init__(self, n_states, n_actions, lr=0.1, gamma=0.99, epsilon=0.1):
        self.q_table = np.zeros((n_states, n_actions))
        self.lr = lr
        self.gamma = gamma
        self.epsilon = epsilon
    
    def choose_action(self, state):
        if np.random.random() < self.epsilon:
            return np.random.randint(self.q_table.shape[1])
        return np.argmax(self.q_table[state])
    
    def update(self, state, action, reward, next_state):
        best_next = np.max(self.q_table[next_state])
        td_target = reward + self.gamma * best_next
        td_error = td_target - self.q_table[state, action]
        self.q_table[state, action] += self.lr * td_error
```

## The Bellman Equation

> Q(s, a) = r + γ * max(Q(s', a'))

The Bellman equation expresses the relationship between the value of a state-action pair and the values of subsequent state-action pairs.
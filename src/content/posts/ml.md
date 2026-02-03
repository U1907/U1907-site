---
id: ml
title: Machine Learning
category: Guides
date: January 20, 2025
---

Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves.

## Neural Networks

Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes that process information using connectionist approaches to computation.

```python
# filename: neural_network.py
import torch
import torch.nn as nn

class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.layer1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        x = self.layer1(x)
        x = self.relu(x)
        x = self.layer2(x)
        return x

# Create model
model = SimpleNN(10, 64, 2)
```

> "The goal of machine learning is to develop algorithms that can automatically improve through experience." — Tom Mitchell

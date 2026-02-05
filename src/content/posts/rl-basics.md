---
id: transformers
title: Transformers
category: Deep Learning
date: January 25, 2025
tags: Transformers, NLP, Deep Learning, Attention
---

The Transformer architecture, introduced in the paper "Attention Is All You Need", has revolutionized natural language processing and beyond.

## Self-Attention Mechanism

The key innovation of transformers is the self-attention mechanism, which allows the model to weigh the importance of different parts of the input when producing an output.

```python
# filename: attention.py
import torch
import torch.nn as nn
import math

class SelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super(SelfAttention, self).__init__()
        self.embed_size = embed_size
        self.heads = heads
        self.head_dim = embed_size // heads
        
        self.queries = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.keys = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.values = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.fc_out = nn.Linear(heads * self.head_dim, embed_size)
    
    def forward(self, query, keys, values, mask):
        N = query.shape[0]
        q_len, k_len, v_len = query.shape[1], keys.shape[1], values.shape[1]
        
        # Split into heads
        queries = query.reshape(N, q_len, self.heads, self.head_dim)
        keys = keys.reshape(N, k_len, self.heads, self.head_dim)
        values = values.reshape(N, v_len, self.heads, self.head_dim)
        
        # Attention score
        energy = torch.einsum("nqhd,nkhd->nhqk", [queries, keys])
        
        if mask is not None:
            energy = energy.masked_fill(mask == 0, float("-1e20"))
        
        attention = torch.softmax(energy / math.sqrt(self.head_dim), dim=3)
        
        out = torch.einsum("nhql,nlhd->nqhd", [attention, values])
        out = out.reshape(N, q_len, self.heads * self.head_dim)
        
        return self.fc_out(out)
```

## Key Components

1. Query (Q): What we're looking for
2. Key (K): What information is available
3. Value (V): The actual information to retrieve
4. Attention Score: Dot product of Q and K
5. Scaling: Divide by sqrt(d_k) for stability
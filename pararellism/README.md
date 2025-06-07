# Parallel Programming Examples

This repository contains examples of parallel programming implementations in both Elixir and C++, focusing on two main problems:
1. Sum of prime numbers
2. Binary-Hexadecimal palindrome counting

## Compilation and Execution

### Elixir Programs

The Elixir programs don't require compilation. You can run them directly using the `elixir` command:

```bash
# Sum of primes (sequential)
elixir example-2-no-threads.exs <n>

# Sum of primes (parallel)
elixir example-2.exs <n> <threads>

# Binary-Hex palindrome counting (sequential)
elixir example-4-no-pararel.exs <n>

# Binary-Hex palindrome counting (parallel)
elixir example-4.exs <n> <threads>
```

### C++ Programs

To compile the C++ programs:

```bash
# Compile sequential prime sum
g++ example-2-no-parallelism.cpp -o example-2-no-parallelism

# Compile parallel prime sum
g++ example-2.cpp -o example-2

# Compile sequential palindrome counting
g++ example-4-no-thread.cpp -o example-4-no-thread

# Compile parallel palindrome counting
g++ example-4.cpp -o example-4
```

To run the compiled programs:

```bash
# Sequential prime sum
./example-2-no-parallelism <n>

# Parallel prime sum
./example-2 <n> <threads>

# Sequential palindrome counting
./example-4-no-thread <n>

# Parallel palindrome counting
./example-4 <n> <threads>
```

## Performance Analysis

### Test Results (n = 10)

#### Elixir Programs

1. Prime Sum:
   - Sequential: 0.313s (user: 0.31s, system: 0.29s)
   - Parallel (4 threads): 0.367s (user: 0.31s, system: 0.27s)

2. Binary-Hex Palindrome:
   - Sequential: 0.320s (user: 0.28s, system: 0.23s)
   - Parallel (4 threads): 0.317s (user: 0.30s, system: 0.27s)

#### C++ Programs

1. Prime Sum:
   - Sequential: 0.005s (user: 0.00s, system: 0.00s)
   - Parallel (4 threads): 0.005s (user: 0.00s, system: 0.00s)
   - Speedup: 1x with 4 threads

2. Binary-Hex Palindrome:
   - Sequential: 0.619s (user: 0.00s, system: 0.00s, CPU: 1%)
   - Parallel (4 threads): 0.251s (user: 0.01s, system: 0.00s, CPU: 4%)
   - Speedup: 2.47x with 4 threads


## Parallelization Analysis

### Elixir Implementation

The Elixir programs were parallelized using Elixir's built-in concurrency features:

1. Prime Sum Parallelization:
   - The range of numbers is divided into chunks based on the number of threads
   - Each chunk is processed by a separate Task using `Task.async`
   - Results are combined using `Task.await` and `Enum.sum`

2. Binary-Hex Palindrome Parallelization:
   - Similar approach to prime sum
   - Each thread processes a subset of numbers
   - Results are aggregated at the end

### Performance Observations

1. For small inputs (n = 10):
   - The overhead of parallelization in Elixir actually results in slightly slower execution
   - This is expected as the overhead of creating and managing threads outweighs the benefits for small inputs
   - C++ shows significantly better performance for the sequential version

2. System Resource Usage:
   - Elixir parallel versions show higher CPU usage (159-189%)
   - This indicates effective utilization of multiple cores
   


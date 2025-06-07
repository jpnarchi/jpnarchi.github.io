# Practice running a process in parallel using Elixir
#
# The execution should look like:
#   $ elixir example-2.exs <n> <threads>
# Example:
#   $ elixir example-2.exs 1000 4
#
# Juan Pablo Narchi
# 2025-4-6

defmodule PrimeSum do
  # Check if a number is prime
  def is_prime(n) do
    if n < 2 do
      false
    else
      if n == 2 do
        true
      else
        # Check if number is divisible by any number up to its square root
        max = :math.sqrt(n) |> Float.ceil() |> trunc()
        check_divisors(n, 2, max)
      end
    end
  end

  # Check divisors recursively
  defp check_divisors(n, i, max) do
    if i > max do
      true
    else
      if rem(n, i) == 0 do
        false
      else
        check_divisors(n, i + 1, max)
      end
    end
  end

  # Sum all prime numbers up to n
  def sum_primes(n) do
    Enum.reduce(2..n, 0, fn i, acc ->
      if is_prime(i) do
        acc + i
      else
        acc
      end
    end)
  end

  # Sum primes in a range
  def sum_primes_range({start, stop}) do
    Enum.reduce(start..stop, 0, fn i, acc ->
      if is_prime(i) do
        acc + i
      else
        acc
      end
    end)
  end

  # Parallel sum of primes
  def sum_primes_parallel(n, threads) do
    step = div(n, threads)
    # Create the lists of starting and ending values for the ranges
    starts = make_range(2, step, threads)
    stops = make_range(step, step, threads)
    # Join the lists into a list of tuples
    Enum.zip(starts, stops)
    # Send each of the tuples to its own task to compute a partial sum
    |> Enum.map(&Task.async(fn -> sum_primes_range(&1) end))
    # Wait for the results. They will become a list
    |> Enum.map(&Task.await(&1, :infinity))
    # Sum all the elements of the list to get the final result
    |> Enum.sum()
  end

  # Helper function to create ranges
  def make_range(init, step, iters), do: do_make_range(init, step, iters, [])

  defp do_make_range(_init, _step, 0, res), do: Enum.reverse(res)
  defp do_make_range(init, step, iter, res), do: do_make_range(init + step, step, iter - 1, [init | res])
end

defmodule Main do
  def main(args) do
    case args do
      [n] ->
        result = PrimeSum.sum_primes(String.to_integer(n))
        IO.puts("Sequential sum of primes up to #{n} is: #{result}")
      [n, t] ->
        result = PrimeSum.sum_primes_parallel(String.to_integer(n), String.to_integer(t))
        IO.puts("Parallel sum of primes up to #{n} is: #{result}")
      _ ->
        IO.puts("Usage: elixir example-2.exs <n> <threads>")
    end
  end
end

# Run the program
Main.main(System.argv())

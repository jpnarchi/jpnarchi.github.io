# Prime Numbers Sum in Elixir
#
# Usage:
#   $ elixir example-2.exs <n>
# Example:
#   $ elixir example-2.exs 1000
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

        max = :math.sqrt(n) |> Float.ceil() |> trunc()
        check_divisors(n, 2, max)
      end
    end
  end

  # Check divisors
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
end

# Main program
defmodule Main do
  def main(args) do
    case args do
      [n] ->
        result = PrimeSum.sum_primes(String.to_integer(n))
        IO.puts("Sum of prime numbers up to #{n} is: #{result}")
      _ ->
        IO.puts("Usage: elixir example-2.exs <n>")
    end
  end
end

# Run the program
Main.main(System.argv())

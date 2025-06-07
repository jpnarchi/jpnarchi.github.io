# Practice running a process in parallel using Elixir
#
# The execution should look like:
#   $ elixir example-4.exs <n> <threads>
# Example:
#   $ elixir example-4.exs 7 4
#
# Juan Pablo Narchi
# 2025-4-6

defmodule PalindromeCounter do
  # Function to convert number to binary string
  def to_binary(n) when n == 0, do: "0"
  def to_binary(n) do
    Integer.to_string(n, 2)
  end

  # Function to convert number to hexadecimal string
  def to_hex(n) when n == 0, do: "0"
  def to_hex(n) do
    Integer.to_string(n, 16)
  end

  # Function to check if a string is palindrome
  def is_palindrome(s) do
    s == String.reverse(s)
  end

  # Function to check if a number is bin-hex-palindrome
  def is_bin_hex_palindrome(n) do
    is_palindrome(to_binary(n)) and is_palindrome(to_hex(n))
  end

  # Function to count palindromes in a range
  def count_palindromes_range({start, stop}) do
    start..stop
    |> Enum.filter(&is_bin_hex_palindrome/1)
    |> Enum.count()
  end

  # Function to count bin-hex-palindromes up to 2^n using parallel processing
  def count_palindromes_parallel(n, threads) do
    limit = :math.pow(2, n) |> trunc()
    step = div(limit, threads)

    # Create the lists of starting and ending values for the ranges
    starts = make_range(0, step, threads)
    stops = make_range(step - 1, step, threads)

    # Join the lists into a list of tuples
    Enum.zip(starts, stops)
    # Send each of the tuples to its own task to compute a partial count
    |> Enum.map(&Task.async(fn -> count_palindromes_range(&1) end))
    # Wait for the results. They will become a list
    |> Enum.map(&Task.await(&1, :infinity))
    # Sum all the elements of the list to get the final result
    |> Enum.sum()
  end

  # Function to create a range of numbers
  def make_range(init, step, iters), do: do_make_range(init, step, iters, [])

  defp do_make_range(_init, _step, 0, res), do: Enum.reverse(res)
  defp do_make_range(init, step, iter, res), do: do_make_range(init + step, step, iter - 1, [init | res])
end

defmodule Main do
  def main(args) do
    # Check how many arguments were sent
    case args do
      # One argument, compute the count sequentially
      [n] ->
        limit = :math.pow(2, String.to_integer(n)) |> trunc()
        0..limit-1
        |> Enum.filter(&PalindromeCounter.is_bin_hex_palindrome/1)
        |> Enum.count()
        |> IO.inspect(label: "Sequential count of bin-hex-palindromes up to 2^#{n}")
      [n, t] ->
        PalindromeCounter.count_palindromes_parallel(String.to_integer(n), String.to_integer(t))
        |> IO.inspect(label: "Parallel count of bin-hex-palindromes up to 2^#{n}")
      _ ->
        IO.puts("Usage: \n $ elixir example-4.exs <n> <threads>")
    end
  end
end

# Call the main function with the arguments used in the command line
Main.main(System.argv())

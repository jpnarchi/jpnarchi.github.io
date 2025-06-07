# Practice running a process in parallel using Elixir
#
# The execution should look like:
#   $ elixir example-4-no-pararel.exs <n>
# Example:
#   $ elixir example-4-no-pararel.exs 7
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

  # Function to count bin-hex-palindromes up to 2^n
  def count_palindromes(n) do
    limit = :math.pow(2, n) |> trunc()
    0..limit-1
    |> Enum.filter(&is_bin_hex_palindrome/1)
    |> Enum.count()
  end
end

defmodule Main do
  def main(args) do
    # Check how many arguments were sent
    case args do
      [n] ->
        PalindromeCounter.count_palindromes(String.to_integer(n))
        |> IO.inspect(label: "Count of bin-hex-palindromes up to 2^#{n}")
      _ ->
        IO.puts("Usage: \n $ elixir example-4-no-pararel.exs <n>")
    end
  end
end

# Call the main function with the arguments used in the command line
Main.main(System.argv())

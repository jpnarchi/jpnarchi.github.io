# Python Lexical Analyzer

## Project Overview
This project implements a lexical analyzer for Python code using Elixir. The analyzer reads Python source files and generates HTML output with syntax highlighting, identifying different lexical categories (tokens) in the code.

## Implementation Details

### Target Language: Python
The lexer identifies the following lexical categories in Python code:

1. **Keywords**: Reserved words like `def`, `class`, `if`, `else`, etc.
2. **Built-in Types**: Data types like `str`, `int`, `float`, `list`, etc.
3. **Decorators**: Python decorators starting with `@`
4. **Operators**: Arithmetic, comparison, and logical operators
5. **Delimiters**: Brackets, parentheses, and braces
6. **String Literals**: Single, double, and triple-quoted strings
7. **Numbers**: Integers, floats, hex, octal, and binary numbers
8. **Comments**: Single-line comments starting with `#`
9. **Special Methods**: Methods like `__init__`, `__str__`, etc.
10. **Class Names**: Identifiers starting with uppercase letters
11. **Function Calls**: Function names followed by parentheses
12. **Identifiers**: Variable and function names
13. **Whitespace**: Spaces and tabs

### Development Language: Elixir
The project is implemented in Elixir, following these key design decisions:

1. **Regular Expressions**: Each lexical category is defined using regular expressions for pattern matching
2. **Token Processing**: The code processes input line by line, maintaining proper line breaks
3. **HTML Generation**: Output is formatted with CSS styling for syntax highlighting
4. **Error Handling**: Graceful handling of malformed input

## Usage

```bash
elixir lexer.exs input_file.py output_file.html
```

## Implementation Analysis

### Time Complexity
The time complexity of the lexer can be analyzed as follows:

1. **File Reading**: O(n) where n is the file size
2. **Line Processing**: O(m) where m is the number of lines
3. **Token Matching**: O(k) where k is the length of each line
4. **HTML Generation**: O(t) where t is the total number of tokens

Overall time complexity: O(n + m*k + t)

The space complexity is O(n) for storing the input file and generated HTML.

### Performance Considerations
- The lexer processes input line by line to maintain memory efficiency
- Regular expressions are pre-compiled for better performance
- Token matching is optimized by checking whitespace first
- HTML generation is done incrementally to avoid large string concatenations

### Detailed Time Complexity Analysis

Let's break down the time complexity of each major operation in the lexer:

1. **File Reading Operation**
   - Time Complexity: O(n)
   - Where n is the total number of characters in the input file
   - This is a single pass through the file content

2. **Line Processing**
   - Time Complexity: O(m)
   - Where m is the number of lines in the file
   - Each line is processed once during the initial split

3. **Token Matching per Line**
   - Time Complexity: O(k * p)
   - Where k is the length of the line
   - Where p is the number of token patterns to check
   - For each character position, we check against multiple regex patterns
   - The number of patterns is constant (13 patterns), so p is O(1)
   - Therefore, this simplifies to O(k)

4. **HTML Generation**
   - Time Complexity: O(t)
   - Where t is the total number of tokens found
   - Each token is processed once to generate its HTML representation

**Overall Time Complexity**:
- Total complexity: O(n + m*k + t)
- Where:
  - n = total file size
  - m = number of lines
  - k = average line length
  - t = total number of tokens

**Comparison with Previous Analysis**:
The previous analysis correctly identified the main components of the time complexity but was less detailed in explaining the relationships between variables. This more detailed analysis shows that:

1. The token matching process is more complex than initially stated, as it involves checking multiple patterns at each position
2. The relationship between line length (k) and number of lines (m) is important, as they both affect the token matching process
3. The total number of tokens (t) is a function of both the file size and the complexity of the code being analyzed

**Space Complexity**:
- O(n) for storing the input file
- O(n) for storing the generated HTML
- O(1) for temporary variables during processing
- Total space complexity: O(n)

This analysis confirms that the lexer's performance is linear with respect to the input size, making it suitable for processing files of various sizes efficiently.

## Ethical Implications

The technology used in this project has several ethical considerations:

1. **Code Analysis**: The ability to analyze code structure could be used for both educational purposes and potentially malicious code analysis
2. **Privacy**: When processing code files, care must be taken to handle sensitive information that might be present in comments or strings
3. **Accessibility**: The HTML output should be accessible to users with disabilities, requiring proper semantic markup
4. **Education**: The tool can be used to help students understand code structure, but should not be used to bypass learning

## Project Structure

```
.
├── lexer.exs          # Main lexer implementation
├── README.md          # This documentation
└── test.py/           #  Python file for testing
```

## Future Improvements

1. Support for multi-line comments
2. Support for f-strings and other Python 3.6+ features
3. Support for different color themes

## Author
Juan Pablo Narchi :)


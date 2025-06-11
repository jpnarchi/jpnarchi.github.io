defmodule Lexer do
  # Regular expressions for Python lexical categories (mejoradas)
  @python_tokens %{
    # palabras clave de Python
    keywords: ~r/def|class|if|else|elif|while|for|in|try|except|finally|with|as|import|from|return|break|continue|pass|raise|yield|async|await|not|and|or|is|None|True|False|lambda|nonlocal|global|del|self/,

    # data types mejore el regex del INT para poder corregir el error de la entrega pasada
    builtins: ~r/(?<![a-zA-Z0-9_])(?:str|int|float|list|dict|set|tuple|bool|bytes|bytearray|complex|frozenset|object|None|True|False)(?![a-zA-Z0-9_])/,

    # decoradores en Python
    decorators: ~r/@[a-zA-Z_][a-zA-Z0-9_\.]*/,

    #  operadores
    operators: ~r/\+|\-|\*|\/|\%|\=|\<|\>|\!|\&|\||\^|\~|\:|\.|,|;|\[|\]|\(|\)|\{|\}/,

    #  delimitadores
    delimiters: ~r/([\[\]\(\)\{\}])/,

    # cadenas de texto (single, double, y triple quotes)
    string_literals: ~r/""".+"""|".+"|'.+'/,

    #  números (enteros, flotantes, hex, etc)
    numbers: ~r/\b(0[xX][0-9a-fA-F]+|0[oO][0-7]+|0[bB][01]+|\d+\.\d*|\.\d+|\d+[eE][+-]?\d+|\d+)\b/,

    #  comentarios
    comments: ~r/#.*$/,

    # métodos especiales como __init__, etc.
    special_methods: ~r/\b__[a-zA-Z_][a-zA-Z0-9_]*__\b/,

    # nombres de clase (empiezan con mayúscula)
    class_names: ~r/\b[A-Z][a-zA-Z0-9_]*\b/,

    # llamadas a funciones
    function_calls: ~r/\b[a-z_][a-zA-Z0-9_]*(?=\s*\()/,

    # nombres de variables
    identifiers: ~r/\b[a-zA-Z_][a-zA-Z0-9_]*\b/,

    # espacios en blanco
    whitespace: ~r/[ \t]+/
  }

  def process_files(input_files, output_dir) do
    # Create tasks for each file
    tasks = input_files
    |> Enum.map(fn input_file ->
      output_file = Path.join(output_dir, Path.basename(input_file, ".py") <> ".html")
      Task.async(fn -> process_file(input_file, output_file) end)
    end)

    # Wait for all tasks to complete and collect results
    results = tasks
    |> Enum.map(fn task -> Task.await(task, :infinity) end)

    # Return results paired with input files
    Enum.zip(input_files, results)
  end

  def process_file(input_file, output_file) do
    # Leer el archivo de entrada
    content = File.read!(input_file)

    # Procesar el contenido
    html_content = generate_html(content)

    # Escribir el archivo de salida
    File.write!(output_file, html_content)

    {:ok, output_file}
  end

  defp generate_html(content) do
    # Estilos generar HTML
    html_header = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Python Code Analysis - Syntax highlighter</title>
        <style>
            /* Estilos mejorados para el resaltado de sintaxis */
            .keywords { color: #569CD6; font-weight: bold; } /* azul VS Code */
            .builtins { color: #4EC9B0; } /* turquesa VS Code */
            .operators { color:rgb(251, 255, 0); } /* gris claro VS Code */
            .delimiters { color: #D4D4D4; } /* gris claro VS Code */
            .string_literals { color: #CE9178; } /* naranja suave VS Code */
            .numbers { color: #B5CEA8; } /* verde suave VS Code */
            .comments { color: #6A9955; font-style: italic; } /* verde comentarios VS Code */
            .special_methods { color: #DCDCAA; } /* amarillo suave VS Code */
            .class_names { color: #4EC9B0; } /* turquesa VS Code */
            .function_calls { color: #DCDCAA; } /* amarillo suave VS Code */
            .decorators { color: #569CD6; } /* azul VS Code */
            .identifiers { color: #9CDCFE; } /* azul claro VS Code */
            .whitespace { white-space: pre; } /* preservar espacios */
            .newline { display: block; } /* forzar salto de línea */

            /* Estilos generales - General styles */
            body {
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 14px;
                margin: 20px;
                background-color: #1E1E1E;
                color: #D4D4D4;
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }

            .header {
                text-align: center;
                padding: 20px;
                background-color: #252526;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }

            .header h1 {
                color: #569CD6;
                margin: 0;
                font-size: 24px;
            }

            .header p {
                color: #9CDCFE;
                margin: 10px 0 0 0;
                font-size: 16px;
            }

            pre {
                background-color: #1E1E1E;
                border: 1px solid #333333;
                border-radius: 5px;
                padding: 15px;
                overflow-x: auto;
                line-height: 1.5;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                flex-grow: 1;
            }

            .footer {
                text-align: center;
                padding: 20px;
                background-color: #252526;
                border-radius: 8px;
                margin-top: 20px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }

            .footer p {
                color: #9CDCFE;
                margin: 0;
                font-size: 14px;
            }

            .line {
                padding: 2px 0;
            }

            .line:hover {
                background-color: #2D2D2D;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Python Code Analysis</h1>
            <p>Syntax highlighter</p>
        </div>
        <pre>
    """

    # Procesar cada línea por separado para mantener los saltos de línea
    lines = String.split(content, "\n")

    html_body = lines
    |> Enum.with_index()
    |> Enum.map(fn {line, _idx} ->
      line_tokens = tokenize_line(line)

      line_html = line_tokens
      |> Enum.map(fn {text, type} ->
        # Escapar caracteres HTML
        escaped_text = String.replace(text, "&", "&amp;")
        |> String.replace("<", "&lt;")
        |> String.replace(">", "&gt;")

        "<span class=\"#{type}\">#{escaped_text}</span>"
      end)
      |> Enum.join("") ## Corrección de programa para que no se junten las líneas

      # Envolver cada línea en un div con número de línea
      "<div class=\"line\">#{line_html}</div>"
    end)
    |> Enum.join("\n") ## Corrección de programa para que no se junten las líneas

    html_footer = """
        </pre>
        <div class="footer">
            <p>Hecho por Juan Pablo Narchi A01781518</p>
        </div>
    </body>
    </html>
    """

    html_header <> html_body <> html_footer
  end

  defp tokenize_line(line) do
    case Regex.run(@python_tokens.comments, line, return: :index) do
      [{start_idx, _}] ->
        before_comment = String.slice(line, 0, start_idx)
        tokens_before = process_tokens(before_comment, [])

        #  Agregar el comentario
        comment = String.slice(line, start_idx, String.length(line))
        tokens_before ++ [{comment, "comments"}]

      nil ->
        # Sin comentario, procesar la línea normalmente
        process_tokens(line, [])
    end
  end

  # Procesar tokens en una línea
  defp process_tokens("", tokens), do: Enum.reverse(tokens)
  defp process_tokens(text, tokens) do
    token_match = find_next_token(text)

    case token_match do
      nil ->
        # No se encontró coincidencia, tomar un carácter y continuar
        {char, rest} = String.split_at(text, 1)
        process_tokens(rest, [{char, "unknown"} | tokens])

      {type, match, length} ->
        # Extraer el token y continuar con el resto
        rest = String.slice(text, length, String.length(text) - length)
        process_tokens(rest, [{match, type} | tokens])
    end
  end

  # Encontrar el siguiente token (usando la primera coincidencia entre tipos de token)
  defp find_next_token(text) do
    whitespace_match = Regex.run(@python_tokens.whitespace, text, return: :index)

    case whitespace_match do
      [{0, length}] ->
        whitespace = String.slice(text, 0, length)
        {"whitespace", whitespace, length}

      _ ->
        # Intentar otros tipos de token
        token_types = [
          {"builtins", @python_tokens.builtins}, ## corregi el error del int
          {"operators", @python_tokens.operators},
          {"comments", @python_tokens.comments},
          {"string_literals", @python_tokens.string_literals},
          {"numbers", @python_tokens.numbers},
          {"keywords", @python_tokens.keywords},
          {"decorators", @python_tokens.decorators},
          {"special_methods", @python_tokens.special_methods},
          {"delimiters", @python_tokens.delimiters},
          {"class_names", @python_tokens.class_names},
          {"function_calls", @python_tokens.function_calls},
          {"identifiers", @python_tokens.identifiers},
        ]

        Enum.find_value(token_types, fn {type, pattern} ->
          case Regex.run(pattern, text, return: :index) do
            [{0, length}] ->
              token = String.slice(text, 0, length)
              {type, token, length}

            _ ->
              nil
          end
        end)
    end
  end
end

defmodule Main do
  def main(args) do
    # Check how many arguments were sent
    case args do
      # Two arguments: input directory and output directory
      [input_dir, output_dir] ->
        # Get all Python files from input directory
        input_files = Path.wildcard(Path.join(input_dir, "*.py"))



          # Process files in parallel
          results = Lexer.process_files(input_files, output_dir)

          # Print results
          IO.puts("--------------------------------")
          IO.puts("--PARARELLISM DONE SUCCESFULLY--")
          IO.puts("--------------------------------")
          Enum.each(results, fn {input_file, {:ok, output_file}} ->
            input_name = Path.basename(input_file) # I did this to show nicely the name of the file and the output file
            output_name = Path.basename(output_file)
            IO.puts("Processed #{input_name} -> #{output_name}")

          end)
        end


    end

end

# Call the main function with the arguments used in the command line
Main.main(System.argv())

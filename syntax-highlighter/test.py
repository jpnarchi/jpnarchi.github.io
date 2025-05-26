# -*- coding: utf-8 -*-

# Importaciones - Imports
import os
import sys
from typing import List, Dict, Optional

# Decoradores - Decorators
@staticmethod
def decorator_example(func):
    def wrapper(*args, **kwargs):
        print("Decorator called")
        return func(*args, **kwargs)
    return wrapper

# Clase de ejemplo - Example class
class TestClass:
    # Clase de prueba con varios elementos - Test class with various elements
    
    def __init__(self, name: str, value: int = 0):
        self.name = name
        self._value = value
        self.__private = "private"
    
    @property
    def value(self) -> int:
        return self._value
    
    @value.setter
    def value(self, new_value: int) -> None:
        if new_value >= 0:
            self._value = new_value
        else:
            raise ValueError("Value must be positive")

# Funciones - Functions
def calculate_sum(a: int, b: int) -> int:
    
    #Calcula la suma de dos números - Calculates the sum of two numbers
    
    return a + b

def process_data(data: List[Dict[str, int]]) -> Optional[Dict[str, float]]:
    try:
        result = {}
        for item in data:
            for key, value in item.items():
                if key not in result:
                    result[key] = 0
                result[key] += value
        return result
    except Exception as e:
        print(f"Error: {e}")
        return None

# Variables y operadores - Variables and operators
x = 10
y = 20.5
z_prueba = x + y
text = "Hello, World!"



# Estructuras de control - Control structures
if x > 0:
    print("Positive number")
elif x < 0:
    print("Negative number")
else:
    print("Zero")

# Bucles - Loops
for i in range(5):
    print(f"Count: {i}")

while x > 0:
    x -= 1
    if x == 5:
        break
    elif x == 3:
        continue

# Lista por comprensión - List comprehension
squares = [i**2 for i in range(10) if i % 2 == 0]

# Expresiones lambda - Lambda expressions
double = lambda x: x * 2

# Manejo de excepciones - Exception handling
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
finally:
    print("Cleanup")

# Ejemplo de uso - Usage example
if __name__ == "__main__":
    # Crear instancia - Create instance
    test = TestClass("Test", 42)
    
    # Llamar funciones - Call functions
    sum_result = calculate_sum(5, 3)
    print(f"Sum: {sum_result}")
    
    # Procesar datos - Process data
    data = [{"a": 1, "b": 2}, {"a": 3, "b": 4}]
    result = process_data(data)
    print(f"Result: {result}")
    
    # Usar lambda - Use lambda
    print(f"Double of 5: {double(5)}")
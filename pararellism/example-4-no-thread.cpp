#include <iostream>
#include <cmath>
#include <string>
#include <algorithm>

using namespace std;

// Structure for the data read from the command line
typedef struct inputs {
    unsigned long long n;
} inputs_t;

string to_binary(int n) {
    if (n == 0) return "0";
    string binary;
    while (n > 0) {
        binary = to_string(n % 2) + binary;
        n /= 2;
    }
    return binary;
}

string to_hex(int n) {
    if (n == 0) return "0";
    string hex;
    while (n > 0) {
        int digit = n % 16;
        char hex_digit = (digit < 10) ? ('0' + digit) : ('a' + digit - 10);
        hex = hex_digit + hex;
        n /= 16;
    }
    return hex;
}

bool is_palindrome(const string& s) {
    string rev = s;
    reverse(rev.begin(), rev.end());
    return s == rev;
}

bool is_bin_hex_palindrome(int n) {
    string binary = to_binary(n);
    string hex = to_hex(n);
    return is_palindrome(binary) && is_palindrome(hex);
}

// Function to count bin-hex-palindromes up to 2^n
int count_bin_hex_palindromes(inputs_t inputs) {
    unsigned long long limit = 1ULL << inputs.n;
    int count = 0;
    
    for (unsigned long long i = 0; i < limit; i++) {
        if (is_bin_hex_palindrome(i)) {
            count++;
        }
    }
    
    return count;
}

// Verify if we got a command line argument
// Otherwise ask the user for it
inputs_t get_args(int argc, char* argv[]) {
    inputs_t inputs;
    if (argc == 2) {
        inputs.n = atoi(argv[1]);
    } else {
        cout << "Enter n (for 2^n): ";
        cin >> inputs.n;
    }
    return inputs;
}

int main(int argc, char* argv[]) {
    inputs_t inputs = get_args(argc, argv);
    cout << "Counting bin-hex-palindromes less than 2^" << inputs.n << endl;
    int count = count_bin_hex_palindromes(inputs);
    cout << "Number of bin-hex-palindromes: " << count << endl;
    return 0;
}

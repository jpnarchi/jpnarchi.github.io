#include <iostream>
#include <cmath>

using namespace std;

// Structure for the data read from the command line
typedef struct inputs {
    unsigned long long n;
} inputs_t;

bool is_prime(int x) {
    if (x < 2) return false;
    if (x == 2) return true;
    int limit = static_cast<int>(ceil(sqrt(x)));
    for (int i = 2; i <= limit; ++i) {
        if (x % i == 0) return false;
    }
    return true;
}

// Function to sum primes up to n sequentially
int sum_primes_sequential(inputs_t inputs) {
    int total_sum = 0;
    
    for (unsigned long long i = 2; i <= inputs.n; i++) {
        if (is_prime(i)) {
            total_sum += i;
        }
    }
    
    return total_sum;
}

// Verify if we got a command line argument
// Otherwise ask the user for it
inputs_t get_args(int argc, char* argv[]) {
    inputs_t inputs;
    if (argc == 2) {
        inputs.n = atoi(argv[1]);
    } else {
        cout << "Enter n (upper limit): ";
        cin >> inputs.n;
    }
    return inputs;
}

int main(int argc, char* argv[]) {
    inputs_t inputs = get_args(argc, argv);
    cout << "Summing primes up to " << inputs.n << endl;
    int sum = sum_primes_sequential(inputs);
    cout << "Sum of primes: " << sum << endl;
    return 0;
} 
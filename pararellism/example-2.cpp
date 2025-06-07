#include <iostream>
#include <cmath>
#include <pthread.h>

using namespace std;

// Structure for the data read from the command line
typedef struct inputs {
    unsigned long long n;
    int threads;
} inputs_t;

// Structure for the data to be sent to the threads
// ME BASE EN TU CÓDIGO PROFESOR
typedef struct thread_data_count {
    int id;
    pthread_t tid;
    pthread_mutex_t * mutex;
    unsigned long long start;
    unsigned long long stop;
    unsigned long long n;
    int * total_sum;
} thread_data_count_t;

bool is_prime(int x) {
    if (x < 2) return false;
    if (x == 2) return true;
    int limit = static_cast<int>(ceil(sqrt(x)));
    for (int i = 2; i <= limit; ++i) {
        if (x % i == 0) return false;
    }
    return true;
}

// Thread function that will sum primes in its range
void * sum_primes_range(void * data) {
    // Cast the pointer to void into the type we actually use
    thread_data_count_t * local_data = (thread_data_count_t *)data;
    // This will be the local counter, independent in each thread
    int local_sum = 0;
    
    for (unsigned long long i = local_data->start; i <= local_data->stop; i++) {
        if (is_prime(i)) {
            local_sum += i;
        }
    }

    // Lock access to the shared variable before modifying it.
    // This will be done only once per thread
    pthread_mutex_lock(local_data->mutex);
        // Dereference the pointer to the total variable
        (*local_data->total_sum) += local_sum;
    pthread_mutex_unlock(local_data->mutex);

    pthread_exit(NULL);
}

// Function to sum primes up to n using threads
int sum_primes_parallel(inputs_t inputs) {
    unsigned long long range = (inputs.n - 1) / inputs.threads;
    
    // Create an array of data structures
    thread_data_count_t * data = new thread_data_count_t[inputs.threads];
    // Create the mutex that will be shared by all threads
    pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
    // Main result variable that will be shared by all threads
    int total_sum = 0;
    // Variable to store the return value of the pthread functions
    int status;

    // Start all the threads
    for (int i = 0; i < inputs.threads; i++) {
        // Fill the data for each of the threads
        data[i].id = i;
        data[i].total_sum = &total_sum;
        data[i].mutex = &mutex;
        // Compute the start and stop values used by each thread
        data[i].start = 2 + (range * i);  // Start from 2 since 0 and 1 are not prime
        data[i].stop = (i == inputs.threads - 1) ? inputs.n : (2 + (range * (i + 1)) - 1);
        data[i].n = inputs.n;

        status = pthread_create(&data[i].tid, NULL, &sum_primes_range, (void *)&data[i]);
        printf("Created thread: %d, Range: [%lld, %lld]\n", i, data[i].start, data[i].stop);
        if (status == -1) {
            perror("ERROR: pthread_create");
        }
    }

    // Wait for the threads to finish
    for (int i = 0; i < inputs.threads; i++) {
        pthread_join(data[i].tid, NULL);
        if (status == -1) {
            perror("ERROR: pthread_join");
        }
    }

    delete[] data;
    return total_sum;
}

// Verify if we got a command line arguments
inputs_t get_args(int argc, char* argv[]) {
    inputs_t inputs;
    if (argc == 3) {
        inputs.n = atoi(argv[1]);
        inputs.threads = atoi(argv[2]);
    } else {
        cout << "Enter n (upper limit): ";
        cin >> inputs.n;
        cout << "Enter the number of threads: ";
        cin >> inputs.threads;
    }
    return inputs;
}

int main(int argc, char* argv[]) {
    inputs_t inputs = get_args(argc, argv);
    cout << "Summing primes up to " << inputs.n << endl;
    int sum = sum_primes_parallel(inputs);
    cout << "Sum of primes: " << sum << endl;
    return 0;
}

import math

# --- Sieve of Atkin ---
def sieve(limit):
    if limit < 2:
        return []
    if limit == 2:
        return [2] # CORRECT: return list of primes
    if limit == 3:
        return [2, 3] # CORRECT: return list of primes

    # Initialize boolean sieve array
    res = [False] * (limit + 1)
    res[2] = True
    res[3] = True

    # Sieve of Atkin algorithm
    sqrt_lim = int(math.isqrt(limit)) + 1
    # Use math.isqrt for integer square root of limit
    for x in range(1, sqrt_lim):
        for y in range(1, sqrt_lim):
            n = 4 * x * x + y * y
            if n <= limit and n % 12 in (1, 5):
                res[n] ^= True

            n = 3 * x * x + y * y
            if n <= limit and n % 12 == 7:
                res[n] ^= True

            n = 3 * x * x - y * y
            if x > y and n <= limit and n % 12 == 11:
                res[n] ^= True

    # Eliminate squares of small primes
    r = 5
    while r * r <= limit:
        if res[r]:
            for k in range(r * r, limit + 1, r * r):
                res[k] = False
        r += 1

    primes = [i for i, is_prime in enumerate(res) if is_prime] # Extract and return list of prime numbers
    return primes


def pick_prime(primes, min_size=1000):
    """returns a suitable prime to use as modulus"""
    for prime in primes:
        if prime >= min_size:
            return prime
    # if no prime large enough exists, use last one on list
    return primes[-1]

def hash(string, modulus):
    """implements polynomial rolling of string keys"""
    hash_value = 5381
    for char in string:
        hash_value = ((hash_value << 5) + hash_value) ^ ord(char)
    return hash_value % modulus

if __name__ == '__main__':
    # generate primes list to use as modulus
    primes = sieve(10000)  # modify limit based on your needs

    modulus = pick_prime(primes, 1000)

    test_array = ["alpha", "beta", "gamma", "delta", "epsilon"]

    for string in test_array:
        hash_value = hash(string, modulus)
        print(f"Hash of {string} is {hash_value}")

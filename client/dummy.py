import math

def shortest_distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

# Example usage:
x1, y1 = 1, 2  # Coordinates of the first point
x2, y2 = 4, 6  # Coordinates of the second point

distance = shortest_distance(x1, y1, x2, y2)
print(f"The shortest distance between ({x1}, {y1}) and ({x2}, {y2}) is {distance:.2f}")
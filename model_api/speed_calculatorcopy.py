import time
import cv2

class SpeedCalculator:
    def __init__(self, red_line_y=None, blue_line_y=None, offset=5, distance=10, red_line_x=None, blue_line_x=None):
        # Ensure at least one set of lines is provided
        if red_line_y is None and red_line_x is None:
            raise ValueError("Either red_line_y/blue_line_y (horizontal) or red_line_x/blue_line_x (vertical) must be provided.")

        self.red_line_y = red_line_y
        self.blue_line_y = blue_line_y
        self.red_line_x = red_line_x
        self.blue_line_x = blue_line_x
        self.offset = offset
        self.distance = distance
        self.down = {}
        self.up = {}
        self.counter_down = []
        self.counter_up = []

    def calculate_speed(self, cx, cy, id, frame, bbox):
        x3, y3, x4, y4 = bbox

        # Handling horizontal lines (if provided)
        if self.red_line_y is not None and self.blue_line_y is not None:
            # Vehicle going down
            if self.red_line_y - self.offset < cy < self.red_line_y + self.offset:
                self.down[id] = time.time()

            if id in self.down:
                if self.blue_line_y - self.offset < cy < self.blue_line_y + self.offset:
                    exit_time = time.time()
                    elapsed_time = exit_time - self.down[id]
                    if id not in self.counter_down:
                        self.counter_down.append(id)
                        speed_kmh = self.calculate_kmh(elapsed_time)
                        self.display_speed(frame, id, bbox, speed_kmh)
                        entry_time = self.down[id]
                        return speed_kmh, entry_time, exit_time

            # Vehicle going up
            if self.blue_line_y - self.offset < cy < self.blue_line_y + self.offset:
                self.up[id] = time.time()

            if id in self.up:
                if self.red_line_y - self.offset < cy < self.red_line_y + self.offset:
                    exit_time = time.time()
                    elapsed_time = exit_time - self.up[id]
                    if id not in self.counter_up:
                        self.counter_up.append(id)
                        speed_kmh = self.calculate_kmh(elapsed_time)
                        self.display_speed(frame, id, bbox, speed_kmh)
                        entry_time = self.up[id]
                        return speed_kmh, entry_time, exit_time

        # Handling vertical lines (if provided)
        if self.red_line_x is not None and self.blue_line_x is not None:
            # Vehicle moving left to right
            if self.red_line_x - self.offset < cx < self.red_line_x + self.offset:
                self.down[id] = time.time()

            if id in self.down:
                if self.blue_line_x - self.offset < cx < self.blue_line_x + self.offset:
                    exit_time = time.time()
                    elapsed_time = exit_time - self.down[id]
                    if id not in self.counter_down:
                        self.counter_down.append(id)
                        speed_kmh = self.calculate_kmh(elapsed_time)
                        self.display_speed(frame, id, bbox, speed_kmh)
                        entry_time = self.down[id]
                        return speed_kmh, entry_time, exit_time

            # Vehicle moving right to left
            if self.blue_line_x - self.offset < cx < self.blue_line_x + self.offset:
                self.up[id] = time.time()

            if id in self.up:
                if self.red_line_x - self.offset < cx < self.red_line_x + self.offset:
                    exit_time = time.time()
                    elapsed_time = exit_time - self.up[id]
                    if id not in self.counter_up:
                        self.counter_up.append(id)
                        speed_kmh = self.calculate_kmh(elapsed_time)
                        self.display_speed(frame, id, bbox, speed_kmh)
                        entry_time = self.up[id]
                        return speed_kmh, entry_time, exit_time

        return None, None, None

    def calculate_kmh(self, elapsed_time):
        speed_mps = (self.distance / elapsed_time) / 2
        speed_kmh = speed_mps * 3.6
        return speed_kmh

    def display_speed(self, frame, id, bbox, speed_kmh):
        x3, y3, x4, y4 = bbox
        cv2.circle(frame, ((x3 + x4) // 2, (y3 + y4) // 2), 4, (0, 0, 255), -1)
        cv2.putText(frame, f'{int(speed_kmh)} Km/h', (x4, y4), cv2.FONT_HERSHEY_COMPLEX, 0.8, (0, 255, 255), 2)

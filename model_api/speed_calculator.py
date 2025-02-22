import time
import cv2

class SpeedCalculator:
    def __init__(self, red_line_y, blue_line_y, offset, distance):
        self.red_line_y = red_line_y
        self.blue_line_y = blue_line_y
        self.offset = offset
        self.distance = distance
        self.down = {}
        self.up = {}
        self.counter_down = []
        self.counter_up = []

    def calculate_speed(self, cx, cy, id, frame, bbox):
        x3, y3, x4, y4 = bbox

        # Vehicle going down
        if self.red_line_y - self.offset < cy < self.red_line_y + self.offset:
            self.down[id] = time.time()

        if id in self.down:
            if self.blue_line_y - self.offset < cy < self.blue_line_y + self.offset:
                exit_time = time.time()
                elapsed_time = time.time() - self.down[id]
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
                elapsed_time = time.time() - self.up[id]
                if id not in self.counter_up:
                    self.counter_up.append(id)
                    speed_kmh = self.calculate_kmh(elapsed_time)
                    self.display_speed(frame, id, bbox, speed_kmh)
                    entry_time = self.down[id]
                    return speed_kmh, entry_time, exit_time
        
        return None, None, None

    def calculate_kmh(self, elapsed_time):
        speed_mps = self.distance / elapsed_time/2
        speed_kmh = speed_mps * 3.6
        return speed_kmh

    def display_speed(self, frame, id, bbox, speed_kmh):
        x3, y3, x4, y4 = bbox
        cv2.circle(frame, ((x3 + x4) // 2, (y3 + y4) // 2), 4, (0, 0, 255), -1)
        cv2.putText(frame, f'{int(speed_kmh)} Km/h', (x4, y4), cv2.FONT_HERSHEY_COMPLEX, 0.8, (0, 255, 255), 2)


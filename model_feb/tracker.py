import math

class Tracker:
    def __init__(self, max_distance=23, max_disappeared=6) -> None:
        self.center_points = {}  # Store center points of objects
        self.id_count = 0  # ID count for assigning unique IDs to each object
        self.disappeared = {}  # Track how long each object has been missing
        self.max_distance = max_distance  # Max distance to consider as the same object
        self.max_disappeared = max_disappeared  # Max frames an object can disappear

    def update(self, objects_rect):
        objects_bbs_ids = []

        for rect in objects_rect:
            x, y, w, h = rect
            cx = (x + x + w) // 2
            cy = (y + y + h) // 2

            same_object_detected = False
            # Find the closest existing object within max_distance
            closest_id = None
            closest_dist = float('inf')

            for id, pt in self.center_points.items():
                dist = math.hypot(cx - pt[0], cy - pt[1])
                if dist < closest_dist and dist < self.max_distance:
                    closest_dist = dist
                    closest_id = id

            # If we have found a matching object within distance, update its position
            if closest_id is not None:
                self.center_points[closest_id] = (cx, cy)
                self.disappeared[closest_id] = 0  # Reset disappearance counter
                objects_bbs_ids.append([x, y, w, h, closest_id])
                same_object_detected = True

            # If it's a new object, assign it a new ID
            if not same_object_detected:
                self.center_points[self.id_count] = (cx, cy)
                self.disappeared[self.id_count] = 0
                objects_bbs_ids.append([x, y, w, h, self.id_count])
                self.id_count += 1

        # Mark disappeared objects and remove those that have exceeded max_disappeared frames
        new_center_points = {}
        new_disappeared = {}
        for object_id in list(self.center_points.keys()):
            if object_id not in [obj[4] for obj in objects_bbs_ids]:
                self.disappeared[object_id] += 1
                if self.disappeared[object_id] <= self.max_disappeared:
                    new_center_points[object_id] = self.center_points[object_id]
                    new_disappeared[object_id] = self.disappeared[object_id]
            else:
                new_center_points[object_id] = self.center_points[object_id]
                new_disappeared[object_id] = self.disappeared[object_id]

        self.center_points = new_center_points
        self.disappeared = new_disappeared

        return objects_bbs_ids

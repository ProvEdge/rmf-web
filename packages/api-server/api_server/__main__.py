import threading
import time
import tracemalloc

import uvicorn

from .app import app

# from pympler import muppy, summary
# from pympler import tracker


exit = threading.Event()

tracemalloc.start()


def debug():
    while not exit.is_set():
        snapshot = tracemalloc.take_snapshot()
        top_stats = snapshot.statistics("lineno")

        print("=============================================")
        print("[ Mem Trace with tracemalloc ]")
        for stat in top_stats[:15]:
            print(stat)
        print("=============================================")
        # tr.print_diff()
        exit.wait(30)


def main():
    debug_thread = threading.Thread(target=debug)
    debug_thread.start()
    uvicorn.run(app, host="0.0.0.0", port=8000)
    exit.set()
    debug_thread.join()


if __name__ == "__main__":
    main()

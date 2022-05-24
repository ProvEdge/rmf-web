import threading
import time
import tracemalloc

import uvicorn

from .app import app
from .app_config import app_config

# from pympler import muppy, summary
# from pympler import tracker

exit = threading.Event()

tracemalloc.start()


def debug():
    while not exit.is_set():
        snapshot = tracemalloc.take_snapshot()
        top_stats = snapshot.statistics("lineno")

        print("=============================================")
        print("[ Mem Usage debug with tracemalloc ]")
        for stat in top_stats[:20]:
            print(stat)
        print("=============================================")
        # tr.print_diff()
        exit.wait(60)


def main():
    debug_thread = threading.Thread(target=debug)
    debug_thread.start()
    uvicorn.run(
        app,
        host=app_config.host,
        port=app_config.port,
        root_path=app_config.public_url.path,
        log_level=app_config.log_level.lower(),
    )

    exit.set()
    debug_thread.join()


if __name__ == "__main__":
    main()

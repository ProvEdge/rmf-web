# generated by datamodel-codegen:
#   filename:  task_log.schema.json

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from ..log_entry import schema


class TaskEventLog(BaseModel):
    task_id: str
    log: Optional[List[schema.LogEntry]] = Field(
        None, description="Log entries related to the overall task"
    )
    phases: Optional[Dict[str, Dict[str, Any]]] = Field(
        None,
        description="A dictionary whose keys (property names) are the indices of a phase",
    )

# generated by datamodel-codegen:
#   filename:  resume_task_request.schema.json

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class TaskResumeRequest(BaseModel):
    type: Optional[str] = Field(
        None, description="Indicate that this is a task resuming request"
    )
    for_task: Optional[str] = Field(None, description="Specify task ID to resume.")
    for_tokens: Optional[List[str]] = Field(
        None,
        description="A list of tokens of interruption requests which should be resumed. The interruption request associated with each token will be discarded.",
        min_items=1,
    )
    labels: Optional[List[str]] = Field(
        None, description="Labels describing this request"
    )

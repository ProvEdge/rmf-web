# generated by datamodel-codegen:
#   filename:  interrupt_task_response.json

from __future__ import annotations

from pydantic import BaseModel, Field

from .token_response import schema


class TaskInterruptionResponse(BaseModel):
    __root__: schema.TokenResponse = Field(
        ...,
        description="Response to a request for a task to be interrupted",
        title="Task Interruption Response",
    )

from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Optional

# Dữ liệu gửi lên khi tạo Section
class SectionCreate(BaseModel):
    teacherUserID: UUID
    code: str
    name: str
    description: Optional[str] = None

# Dữ liệu trả về cho Client
class SectionResponse(BaseModel):
    sectionID: UUID
    teacherUserID: UUID
    code: str
    name: str
    description: Optional[str]
    isDeleted: bool

    model_config = ConfigDict(from_attributes=True)
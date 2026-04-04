from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr
    fullName: str
    status: str | None = None

class UserCreate(UserBase):
    password: str
    role: str

class TeacherCreate(UserBase):
    password: str

class StudentCreate(UserBase):
    password: str
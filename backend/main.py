from fastapi import FastAPI
import uvicorn
from pydantic_config import settings

app = FastAPI()
items = []

@app.get("/")
def root():
    return {
        "Hello" : "World"
    }


@app.post("/items")
def create_item(item: str):
    items.append(item)
    return items

@app.get("/items/{item_id}")
def getItem(item_id: int)-> str: 
    return items[item_id]

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.APP_PORT
    )

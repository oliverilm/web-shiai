from ninja import Schema

class UtilMessageSchema(Schema):
    message: str
    status: str

class UtilMessage:
    message = ""
    status = ""

    def __init__(self, message = "Something went right", status = "success"):
        if message:
            self.message = message
        if status:
            self.status = status

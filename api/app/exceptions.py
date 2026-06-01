from fastapi import HTTPException


class KnaqException(HTTPException):
    pass


class NotFoundError(KnaqException):
    def __init__(self, detail: str = "Not found"):
        super().__init__(status_code=404, detail=detail)


class TransitionError(KnaqException):
    def __init__(self, detail: str = "Invalid status transition"):
        super().__init__(status_code=409, detail=detail)


class AuthError(KnaqException):
    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(status_code=401, detail=detail)

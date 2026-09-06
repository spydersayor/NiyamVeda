from typing import Optional

from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company_name: Optional[str] = "MSME Manufacturing Ltd."
    role: Optional[str] = "MSME_MANUFACTURER"

    @field_validator("email", mode="before")
    @classmethod
    def clean_and_validate_email(cls, value):
        if not isinstance(value, str):
            raise ValueError("Email must be a string")

        # Normalize user input before Pydantic's EmailStr validation.
        email = value.strip().lower()

        if not email:
            raise ValueError("Email address cannot be empty")

        # Split only after confirming there is exactly one @.
        if email.count("@") != 1:
            raise ValueError("Email must contain exactly one @ symbol")

        local_part, domain_part = email.split("@")

        if not local_part:
            raise ValueError("Email must have a non-empty local part")

        if not domain_part:
            raise ValueError("Email must have a non-empty domain")

        # RFC-style local-part dot rules.
        if local_part.startswith(".") or local_part.endswith("."):
            raise ValueError("Email local part cannot start or end with a dot")

        if ".." in local_part:
            raise ValueError("Email local part cannot contain consecutive dots")

        # Basic domain structure checks.
        if domain_part.startswith(".") or domain_part.endswith("."):
            raise ValueError("Invalid domain structure")

        if ".." in domain_part:
            raise ValueError("Domain cannot contain consecutive dots")

        domain_labels = domain_part.split(".")

        # Require a domain and TLD.
        if len(domain_labels) < 2:
            raise ValueError("Email domain must contain a top-level domain")

        if any(not label for label in domain_labels):
            raise ValueError("Invalid domain structure")

        # Domain labels cannot start/end with hyphens.
        for label in domain_labels:
            if label.startswith("-") or label.endswith("-"):
                raise ValueError("Invalid domain label")

        # TLD must contain alphabetic characters only and be at least 2 chars.
        tld = domain_labels[-1]

        if len(tld) < 2 or not tld.isalpha():
            raise ValueError("Invalid top-level domain")

        return email

    @field_validator("email")
    @classmethod
    def normalize_validated_email(cls, value: EmailStr) -> str:
        # EmailStr has now performed Pydantic's own email validation.
        # Store the normalized representation as a plain string.
        return str(value).strip().lower()


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def clean_and_validate_email(cls, value):
        """
        Apply the same normalization and structural validation as UserRegister
        so the backend independently rejects malformed emails.
        """
        if not isinstance(value, str):
            raise ValueError("Email must be a string")

        # Normalize before Pydantic's EmailStr validation.
        email = value.strip().lower()

        if not email:
            raise ValueError("Email address cannot be empty")

        # Split only after confirming there is exactly one @.
        if email.count("@") != 1:
            raise ValueError("Email must contain exactly one @ symbol")

        local_part, domain_part = email.split("@")

        if not local_part:
            raise ValueError("Email must have a non-empty local part")

        if not domain_part:
            raise ValueError("Email must have a non-empty domain")

        # RFC-style local-part dot rules.
        if local_part.startswith(".") or local_part.endswith("."):
            raise ValueError("Email local part cannot start or end with a dot")

        if ".." in local_part:
            raise ValueError("Email local part cannot contain consecutive dots")

        # Basic domain structure checks.
        if domain_part.startswith(".") or domain_part.endswith("."):
            raise ValueError("Invalid domain structure")

        if ".." in domain_part:
            raise ValueError("Domain cannot contain consecutive dots")

        domain_labels = domain_part.split(".")

        # Require a domain and TLD.
        if len(domain_labels) < 2:
            raise ValueError("Email domain must contain a top-level domain")

        if any(not label for label in domain_labels):
            raise ValueError("Invalid domain structure")

        # Domain labels cannot start/end with hyphens.
        for label in domain_labels:
            if label.startswith("-") or label.endswith("-"):
                raise ValueError("Invalid domain label")

        # TLD must contain alphabetic characters only and be at least 2 chars.
        tld = domain_labels[-1]

        if len(tld) < 2 or not tld.isalpha():
            raise ValueError("Invalid top-level domain")

        return email

    @field_validator("email")
    @classmethod
    def normalize_validated_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    company_name: str
    role: str
    created_at: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
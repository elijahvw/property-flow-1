variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "property-flow"
}

variable "db_password" {
  description = "RDS database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for token signing"
  type        = string
  sensitive   = true
}

variable "auth0_domain" {
  description = "Auth0 tenant domain (e.g., dev-xxx.us.auth0.com)"
  type        = string
}

variable "auth0_audience" {
  description = "Auth0 API audience identifier"
  type        = string
}

variable "auth0_client_id" {
  description = "Auth0 SPA client ID (used at build time for frontend)"
  type        = string
}

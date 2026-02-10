#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TERRAFORM_DIR="$PROJECT_DIR/terraform"

echo "========================================="
echo "  PropertyFlow AWS Deployment"
echo "========================================="

if ! command -v terraform &> /dev/null; then
  echo "ERROR: terraform is not installed. Install it from https://www.terraform.io/downloads"
  exit 1
fi

if ! command -v aws &> /dev/null; then
  echo "ERROR: AWS CLI is not installed. Install it from https://aws.amazon.com/cli/"
  exit 1
fi

aws sts get-caller-identity > /dev/null 2>&1 || {
  echo "ERROR: AWS credentials not configured. Run 'aws configure' first."
  exit 1
}

echo ""
echo "[1/6] Running tests..."
cd "$PROJECT_DIR"
pnpm test

echo ""
echo "[2/6] Building Lambda backend..."
pnpm run build:lambda

echo ""
echo "[3/6] Initializing Terraform..."
cd "$TERRAFORM_DIR"

if [ ! -f terraform.tfvars ]; then
  echo "ERROR: terraform/terraform.tfvars not found."
  echo "Copy terraform.tfvars.example to terraform.tfvars and fill in your values."
  exit 1
fi

terraform init

echo ""
echo "[4/6] Planning infrastructure changes..."
terraform plan -out=tfplan

echo ""
read -p "Apply these changes? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Deployment cancelled."
  exit 0
fi

echo ""
echo "[5/6] Applying infrastructure..."
terraform apply tfplan
rm -f tfplan

API_URL=$(terraform output -raw api_url)
BUCKET_NAME=$(terraform output -raw frontend_bucket_name)
CF_DIST_ID=$(terraform output -raw cloudfront_distribution_id)
FRONTEND_URL=$(terraform output -raw frontend_url)

echo ""
echo "[6/6] Building and deploying frontend..."
cd "$PROJECT_DIR"

VITE_API_URL="$API_URL" \
VITE_AUTH0_DOMAIN="${VITE_AUTH0_DOMAIN:-}" \
VITE_AUTH0_CLIENT_ID="${VITE_AUTH0_CLIENT_ID:-}" \
VITE_AUTH0_AUDIENCE="${VITE_AUTH0_AUDIENCE:-}" \
pnpm run build:client

aws s3 sync dist/spa/ "s3://$BUCKET_NAME" --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$CF_DIST_ID" \
  --paths "/*" > /dev/null

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "========================================="
echo ""
echo "  Frontend: $FRONTEND_URL"
echo "  API:      $API_URL"
echo ""
echo "IMPORTANT: Update your Auth0 application settings:"
echo "  - Allowed Callback URLs:    $FRONTEND_URL/dashboard"
echo "  - Allowed Logout URLs:      $FRONTEND_URL"
echo "  - Allowed Web Origins:      $FRONTEND_URL"
echo "  - Allowed CORS Origins:     $FRONTEND_URL"
echo ""
echo "To run database migrations against RDS:"
echo "  DATABASE_URL=<rds_connection_string> pnpm migrate"
echo ""
